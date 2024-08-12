import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasePokemon, Pokemon, PokemonEvo } from '../models/pokemon';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  allPokemonList: Pokemon[] = []; // Lista completa de Pokémon para busca
  pokemonList: Pokemon[] = []; // Lista de Pokémon para exibição paginada
  filteredPokemon: Pokemon[] = []; // Lista de Pokémon filtrados


  constructor(private http: HttpClient) { }

  getPokemonList(offset: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  getAllPokemon(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=1230`);
  }

  getPokemon(name: string): Observable<BasePokemon> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      map(response => ({
        id: response.id,
        name: response.name,
        url: `${this.apiUrl}/${name}`,
        image: response.sprites.other['official-artwork'].front_default,
        types: response.types.map((typeInfo: any) => typeInfo.type.name),
      } as BasePokemon))
    );
  }

  getPokemons(name: string): Observable<Pokemon> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      switchMap(response => {
        const pokemon: Pokemon = {
          id: response.id,
          name: response.name,
          url: `${this.apiUrl}/${name}`,
          image: response.sprites.other['official-artwork'].front_default,
          height: response.height,
          weight: response.weight,
          types: response.types.map((typeInfo: any) => typeInfo.type.name),
          stats: response.stats.map((statInfo: any) => ({
            name: statInfo.stat.name,
            base_stat: statInfo.base_stat
          })),
          urlSpecies: response.species.url,
          urlChainEvo: null,
        };

        return this.http.get<any>(pokemon.urlSpecies).pipe(
          switchMap(speciesResponse => {
            pokemon.urlChainEvo = speciesResponse.evolution_chain.url;

            return this.http.get<any>(pokemon.urlChainEvo).pipe(
              map(evolutionChainResponse => {
                const evolutions: PokemonEvo = {
                  evo1: evolutionChainResponse.chain.species.name || null,
                  evo2: evolutionChainResponse.chain.evolves_to[0]?.species?.name || null,
                  evo3: evolutionChainResponse.chain.evolves_to[0]?.evolves_to[0]?.species?.name || null,
                }
                pokemon.evolutionChain = [evolutions];
                return pokemon;
              })
            );
          })
        );
      })
    );
  }
}











