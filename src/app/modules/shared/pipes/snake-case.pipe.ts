import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCase',
  pure: true,
  standalone: true,
})
export class SnakeCasePipe implements PipeTransform {
  transform(value: string): string {
    const parts = value.split('_');
    return parts.map((part) => part.toLocaleLowerCase()).join(' ');
  }
}
