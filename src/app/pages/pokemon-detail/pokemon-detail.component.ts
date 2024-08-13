import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePokemon, Pokemon } from '../../models/pokemon';
import { forkJoin } from 'rxjs';
import { PokemonSearchService } from '../../services/pokemon-search.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  pokemon: any ;
  pokemonEvo: any;
  name : string | any;
  urlEvo : any;
  evolutions: BasePokemon[] = [];
  result: any;
  filteredPokemon: Pokemon[] = [];
  offset: number = 0;
  limit: number = 20;
  inputValue: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private pokemonService: PokemonService,
    private pokemonSearchService: PokemonSearchService
  ) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getPokemon(this.name);

    this.pokemonSearchService.pokemonList$.subscribe(data => {
      this.filteredPokemon = data.slice(this.offset, this.offset + this.limit);
      this.loadPokemonDetails(this.filteredPokemon);
    });

    this.pokemonSearchService.currentInputValue.subscribe(value => {
      this.inputValue = value;
    });
    this.inputValue = '';
    
  }

  getPokemon(name: string): void {
    this.pokemonService.getPokemons(name).subscribe(data => {
      this.pokemon = data;
      const evolutionNames = this.pokemon.evolutionChain?.[0];
      const evolutionRequests = [];
      
      // Limpa a lista de evoluções para evitar requisições duplicadas
      this.evolutions = [];

      if (evolutionNames?.evo1 && evolutionNames.evo1.toLowerCase() ) {
        evolutionRequests.push(this.pokemonService.getPokemon(evolutionNames.evo1));
      }
      if (evolutionNames?.evo2 && evolutionNames.evo2.toLowerCase() ) {
        evolutionRequests.push(this.pokemonService.getPokemon(evolutionNames.evo2));
      }
      if (evolutionNames?.evo3 && evolutionNames.evo3.toLowerCase()) {
        evolutionRequests.push(this.pokemonService.getPokemon(evolutionNames.evo3));
      }

      forkJoin(evolutionRequests).subscribe(evolutionData => {
        this.evolutions = evolutionData;
      });
      console.log(this.pokemon.evolutionChain)
    });
  }

  //!== name.toLowerCase()

  replaceHyphens(name: string): string {
    return name.replace(/-/g, ' ');
  }

  convertMetros(valor:string) {
    const valorInt = parseFloat(valor);
    var result: any;
    if (valorInt < 10) { // Número com 1 dígito
      const grams = valorInt * 10;
      result = grams + "cm";
    } else if (valorInt < 100) { // Número com 2 dígitos
        const kilograms = valorInt / 10.0;
        result = kilograms + "M";
    } 
  return result 
  }

  convertKg(valor:string){
    const valorInt = parseFloat(valor);
    var result: any;
    
    return result = (valorInt / 10).toString().replace(".", ",");
   }

  onEvolution(name: string): void {
    this.router.navigate(['/detail', name])
      .then(() => {
        // Aguarda a navegação para garantir que o parâmetro 'name' seja atualizado
        this.getPokemon(name);
      });
  }

  filterPokemon(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase().replace(/ /g, '-');
    this.pokemonSearchService.searchPokemon(value);
  }

  loadPokemonDetails(pokemonList: Pokemon[]): void {
    pokemonList.forEach(pokemon => {
      this.pokemonSearchService.getPokemonDetails(pokemon).subscribe(details => {
        // Atualiza os detalhes do Pokémon na lista original
        pokemon.id = details.id;
        pokemon.image = details.image;
      });
    });
  }

  viewDetails(pokemonName: string): void {
    this.router.navigate(['/detail', pokemonName])
    .then(() => {
      // Aguarda a navegação para garantir que o parâmetro 'name' seja atualizado
      this.getPokemon(pokemonName);
    });
    this.inputValue = '';
    this.pokemonSearchService.clearSearchTerm();
    console.log("blz!!")
    
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200, // Ajuste o valor conforme necessário
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200, // Ajuste o valor conforme necessário
      behavior: 'smooth'
    });
  }

  nextPokemon(){
    const next = (this.pokemon.id + 1).toString();
    this.viewDetails(next);
  }

  previousPokemon(){
    const previous = (this.pokemon.id - 1).toString();
    this.viewDetails(previous);
  }

  statPorcentagem(stat: number){
    const value = stat * 100 / 170;
    return value 
  }
}

// quando clicar na evolução subir a pagina pro topo 
// arrumar visualização para dispositivos moveis 
