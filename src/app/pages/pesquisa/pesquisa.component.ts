import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.css']
})
export class PesquisaComponent implements OnInit {
  searchTerm: string = '';
  pokemon: any = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'];
      if (this.searchTerm) {
        this.pokemonService.getPokemon(this.searchTerm).subscribe(data => {
          this.pokemon = data;
        });
      }
    });
  }
}