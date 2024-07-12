import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'] // Corrigido o nome da propriedade
})
export class PokemonListComponent implements OnInit {
  allPokemonList: Pokemon[] = []; // Lista completa de Pokémon para busca
  pokemonList: Pokemon[] = []; // Lista de Pokémon para exibição paginada
  filteredPokemon: Pokemon[] = []; // Lista de Pokémon filtrados
  offset: number = 0;
  limit: number = 20;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadAllPokemon(); // Carrega a lista completa de Pokémon para o campo de busca
    this.loadPokemonList(); // Carrega a lista paginada de Pokémon para exibição
  }

  loadAllPokemon(): void {
    let offset = 0;
    let limit = 100; // Ajuste o limite conforme necessário

    // Requisição inicial para obter a lista completa de Pokémon
    const loadBatch = () => {
      this.pokemonService.getPokemonList(offset, limit).subscribe(data => {
        this.allPokemonList = this.allPokemonList.concat(data.results);

        if (data.results.length === limit) {
          offset += limit;
          loadBatch(); // Carrega o próximo lote de Pokémon
        }
      });
    };

    loadBatch();
  }

  loadPokemonList(): void {
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe(data => {
      this.pokemonList = data.results;
      this.filteredPokemon = this.pokemonList;
      this.loadPokemonDetails(this.pokemonList); // Carrega os detalhes dos Pokémon paginados
    });
  }

  loadPokemonDetails(pokemonList: Pokemon[]): void {
    pokemonList.forEach(pokemon => {
      this.getPokemonDetails(pokemon);
    });
  }

  getPokemonDetails(pokemon: Pokemon): void {
    this.pokemonService.getPokemon(pokemon.name).subscribe(details => {
      // Atualiza os detalhes do Pokémon na lista original
      pokemon.id = details.id;
      pokemon.image = details.image;
      pokemon.height = details.height;
      pokemon.weight = details.weight;
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
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (!value) {
      this.filteredPokemon = this.pokemonList; // Mostra a lista paginada de Pokémon se a busca estiver vazia
      this.loadPokemonDetails(this.filteredPokemon); // Carrega detalhes dos Pokémon paginados
      return;
    }

    // Filtra a lista completa de Pokémon para sugestões de busca
    this.filteredPokemon = this.allPokemonList.filter(pokemon => {
      const pokemonName = pokemon.name.toLowerCase();
      return pokemonName.startsWith(value) || pokemonName.includes(` ${value}`);
    });

    // Carrega os detalhes dos Pokémon filtrados
    this.loadPokemonDetails(this.filteredPokemon);
  }
}
