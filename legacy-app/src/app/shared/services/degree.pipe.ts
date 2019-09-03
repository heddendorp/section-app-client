import { Pipe, PipeTransform } from '@angular/core';
import { getTarget } from '../uni-data';

@Pipe({
  name: 'degree',
  pure: true
})
export class DegreePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return getTarget(value);
  }
}
