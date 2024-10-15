import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { PokemonService } from './pokemon.service';
import { Pokemon } from '../models/pokemon';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';

@Injectable({
  providedIn: 'root'
})
export class PokemonSearchService {
  private allPokemonList: Pokemon[] = [];
  private pokemonListSubject = new BehaviorSubject<Pokemon[]>([]);
  pokemonList$ = this.pokemonListSubject.asObservable();
  private inputValueSource = new BehaviorSubject<string>('');
  currentInputValue = this.inputValueSource.asObservable();
  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable();

  constructor(private pokemonService: PokemonService ) {
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

  updateInputValue(value: string) {
    this.inputValueSource.next(value);
  }

  clearSearchTerm() {
    this.searchTerm.next(''); // Limpa o termo de busca
  }
}
