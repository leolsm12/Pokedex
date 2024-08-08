import { Component, OnInit } from '@angular/core';
import { PokemonSearchService } from '../../services/pokemon-search.service';
import { Pokemon } from '../../models/pokemon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  offset: number = 0;
  limit: number = 20;

  constructor(private router: Router, private pokemonSearchService: PokemonSearchService) { }

  ngOnInit(): void {
    this.pokemonSearchService.pokemonList$.subscribe(data => {
      this.filteredPokemon = data.slice(this.offset, this.offset + this.limit);
      this.loadPokemonDetails(this.filteredPokemon);
    });
  }

  loadPokemonList(): void {
    this.pokemonSearchService.pokemonList$.subscribe(data => {
      this.filteredPokemon = data.slice(this.offset, this.offset + this.limit);
      this.loadPokemonDetails(this.filteredPokemon);
    });
  }

  loadPokemonDetails(pokemonList: Pokemon[]): void {
    pokemonList.forEach(pokemon => {
      this.pokemonSearchService.getPokemonDetails(pokemon).subscribe(details => {
        // Atualiza os detalhes do Pokémon na lista original
        pokemon.id = details.id;
        pokemon.image = details.image;
        pokemon.image2 = details.image2;
      });
    });
  }

  prevPage(): void {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.loadPokemonList();
    }
  }

  nextPage(): void {
    this.offset += this.limit;
    this.loadPokemonList();
  }

  filterPokemon(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase().replace(/ /g, '-');
    this.pokemonSearchService.searchPokemon(value);
  }

  replaceHyphens(name: string): string {
    return name.replace(/-/g, ' ');
  }

  viewDetails(pokemonName: string): void {
    this.router.navigate(['/detail', pokemonName]);
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/pokeBall.png';
  }

}
