import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.toLowerCase() // Converte toda a string para minúscula
    .split(' ')    // Separa a string por espaços
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
    .join(' ');    // Junta as palavras novamente em uma string
  }

}
