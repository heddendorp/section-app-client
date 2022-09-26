import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCase',
  pure: true,
})
export class SnakeCasePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const parts = value.split('_');
    return parts.map((part) => part.toLocaleLowerCase()).join(' ');
  }
}
