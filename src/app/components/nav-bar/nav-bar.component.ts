import { Component } from '@angular/core';
import { PokemonSearchService } from '../../services/pokemon-search.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  searchTerm: string = '';

  constructor(private pokemonSearchService: PokemonSearchService) {
    this.pokemonSearchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
    });
   }
   
   onSearchChange(event: any) {
    this.searchTerm = event.target.value;
  } 

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase().replace(/ /g, '-');
    this.pokemonSearchService.searchPokemon(value);
    this.onInputChange(value);

  }

  onInputChange(value: string) {
    this.pokemonSearchService.updateInputValue(value);
  }

  clearSearch(): void {
    this.searchTerm = '';
  }
}
