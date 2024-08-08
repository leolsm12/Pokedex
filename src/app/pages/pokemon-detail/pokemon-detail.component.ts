import { Component, OnInit } from '@angular/core';
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
  pokemon: any ;
  pokemonEvo: any;
  name : string | any;
  urlEvo : any;
  evolutions: BasePokemon[] = [];
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private pokemonService: PokemonService,
    private pokemonSearchService: PokemonSearchService
  ) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getPokemon(this.name);
  }

  getPokemon(name: string): void {
    this.pokemonService.getPokemons(name).subscribe(data => {
      this.pokemon = data;
      console.log(data);
      const evolutionNames = this.pokemon.evolutionChain?.[0];
      const evolutionRequests = [];
      
      // Limpa a lista de evoluções para evitar requisições duplicadas
      this.evolutions = [];

      if (evolutionNames?.evo1 && evolutionNames.evo1.toLowerCase() !== name.toLowerCase()) {
        evolutionRequests.push(this.pokemonService.getPokemon(evolutionNames.evo1));
      }
      if (evolutionNames?.evo2 && evolutionNames.evo2.toLowerCase() !== name.toLowerCase()) {
        evolutionRequests.push(this.pokemonService.getPokemon(evolutionNames.evo2));
      }
      if (evolutionNames?.evo3 && evolutionNames.evo3.toLowerCase() !== name.toLowerCase()) {
        evolutionRequests.push(this.pokemonService.getPokemon(evolutionNames.evo3));
      }

      forkJoin(evolutionRequests).subscribe(evolutionData => {
        this.evolutions = evolutionData;
        console.log(this.evolutions);
      });
    });
  }

  replaceHyphens(name: string): string {
    return name.replace(/-/g, ' ');
  }

  onEvolution(name: string): void {
    this.router.navigate(['/detail', name])
      .then(() => {
        // Aguarda a navegação para garantir que o parâmetro 'name' seja atualizado
        this.getPokemon(name);
      });
  }
}
