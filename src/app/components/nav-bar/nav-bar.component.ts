import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  searchTerm: string = '';

  constructor(private router: Router) { }

  onSearch() {
    this.router.navigate(['/pesquisa'], { queryParams: { term: this.searchTerm } });
  }

}
