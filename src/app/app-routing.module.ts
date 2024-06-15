import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PesquisaComponent } from './pages/pesquisa/pesquisa.component';

const routes: Routes = [
  { path: 'list', component: PokemonListComponent },
  { path: 'pesquisa', component: PesquisaComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: '**', redirectTo: '/list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }