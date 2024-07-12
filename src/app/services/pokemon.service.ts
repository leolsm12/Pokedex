import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  
  constructor(private http: HttpClient) { }

  getPokemonList(offset: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      map(response => ({
        id: response.id,
        name: response.name,
        url: `${this.apiUrl}/${name}`,
        image: response.sprites.other.dream_world.front_default,
        height: response.height,
        weight: response.weight
      }as Pokemon ))
    );
  }
}
