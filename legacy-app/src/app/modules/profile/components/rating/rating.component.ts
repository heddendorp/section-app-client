import { Component, forwardRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  private _onChange: any;
  private _onTouched: any;
  public currentValue = new BehaviorSubject(0);
  public elements = Array.apply(null, Array(5)).map(function (x, i) {
    return i + 1;
  });
  setRating(rating: number) {
    this.currentValue.next(rating);
    this._onChange(rating);
    this._onTouched();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  writeValue(obj: any): void {
    this.currentValue.next(obj);
  }
}
