import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconURL',
  standalone: true,
})
export class IconURLPipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): string {
    const [icon, style] = (value ?? '').split(':');
    return `https://img.icons8.com/${style || 'fluency'}/192/${
      icon || 'nothing-found'
    }.png`;
  }
}
