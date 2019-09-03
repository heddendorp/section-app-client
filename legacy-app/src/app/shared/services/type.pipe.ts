import { Pipe, PipeTransform } from '@angular/core';
import { getType } from '../uni-data';

@Pipe({
  name: 'type',
  pure: true
})
export class TypePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return getType(value);
  }
}
