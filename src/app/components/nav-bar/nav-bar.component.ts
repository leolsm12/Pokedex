import { Component } from '@angular/core';
import { PokemonSearchService } from '../../services/pokemon-search.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private pokemonSearchService: PokemonSearchService) { }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase().replace(/ /g, '-');
    this.pokemonSearchService.searchPokemon(value);
  }
}
