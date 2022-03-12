import { ExtendDatePipe } from './extend-date.pipe';
import { DatePipe } from '@angular/common';

describe('ExtendDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ExtendDatePipe(new DatePipe('en-US'));
    expect(pipe).toBeTruthy();
  });
});
