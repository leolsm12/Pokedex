import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { PokemonService } from './pokemon.service';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonSearchService {
  private allPokemonList: Pokemon[] = [];
  private pokemonListSubject = new BehaviorSubject<Pokemon[]>([]);
  pokemonList$ = this.pokemonListSubject.asObservable();

  constructor(private pokemonService: PokemonService) {
    this.loadAllPokemon(); // Carregar todos os Pokémon ao iniciar o serviço
  }

  private loadAllPokemon(): void {
    let offset = 0;
    let limit = 100;

    const loadBatch = () => {
      this.pokemonService.getPokemonList(offset, limit).subscribe(data => {
        this.allPokemonList = this.allPokemonList.concat(data.results);

        if (data.results.length === limit) {
          offset += limit;
          loadBatch();
        } else {
          this.pokemonListSubject.next(this.allPokemonList);
        }
      });
    };

    loadBatch();
  }

  searchPokemon(query: string): void {
    const filteredPokemon = this.allPokemonList.filter(pokemon => {
      const pokemonName = pokemon.name.toLowerCase();
      return pokemonName.startsWith(query.toLowerCase()) || pokemonName.includes(` ${query.toLowerCase()}`);
    });

    this.pokemonListSubject.next(filteredPokemon);
  }

  getPokemonDetails(pokemon: Pokemon): Observable<Pokemon> {
    return this.pokemonService.getPokemons(pokemon.name);
  }
}
