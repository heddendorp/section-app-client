import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconURL',
})
export class IconURLPipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): string {
    const [icon, style] = (value ?? '').split(':');
    return `https://img.icons8.com/${style ?? 'fluency'}/192/${
      icon ?? 'cancel-2'
    }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
  }
}
