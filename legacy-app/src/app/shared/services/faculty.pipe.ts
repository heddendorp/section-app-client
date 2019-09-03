import { Pipe, PipeTransform } from '@angular/core';
import { getFaculty } from '../uni-data';

@Pipe({
  name: 'faculty',
  pure: true
})
export class FacultyPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return getFaculty(value);
  }
}
