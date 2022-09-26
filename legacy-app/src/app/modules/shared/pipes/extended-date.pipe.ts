import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'date',
})
export class ExtendDatePipe implements PipeTransform {
  readonly customFormats: { [type: string]: string } = {
    medium: 'EEEE, d MMM y, HH:mm',
    short: 'EEE, d MMM, HH:mm',
    shortDate: 'EEE, d MMM',
    shortTime: 'HH:mm',
    mediumDate: 'd MMM y',
    mediumTime: 'HH:mm',
    longDate: 'EEEE, d LLLL',
  };

  transform(value: any, format = 'medium') {
    format = this.customFormats[format] || format;
    if (typeof value === 'object') {
      return DateTime.fromJSDate(value).toFormat(format);
    }
    return DateTime.fromISO(value).toFormat(format);
  }
}
