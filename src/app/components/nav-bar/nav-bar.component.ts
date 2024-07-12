import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonListComponent } from '../../pages/pokemon-list/pokemon-list.component';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  

  constructor(public pokemonList: PokemonListComponent,) { }

  ngOnInit(): void {
      
  }

  

}
