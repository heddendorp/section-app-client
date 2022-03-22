import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import * as atlas from 'azure-maps-rest';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { from, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tumi-location-autocomplete',
  templateUrl: './location-autocomplete.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationAutocompleteComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationAutocompleteComponent implements ControlValueAccessor {
  private searchClient: atlas.SearchURL;
  public locationControl = new FormControl();
  public locationOptions: Observable<atlas.Models.SearchFuzzyResult[]>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (v: atlas.Models.SearchFuzzyResult) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: () => void = () => {};
  constructor() {
    const subscriptionKeyCredential = new atlas.SubscriptionKeyCredential(
      '-kk7lgvH-JWj5-0rWcj-Z9rvlBK1BsUkG5jALx1Poko'
    );
    const pipeline = atlas.MapsURL.newPipeline(subscriptionKeyCredential, {
      retryOptions: { maxTries: 4 },
    });
    this.searchClient = new atlas.SearchURL(pipeline);
    this.locationOptions = this.locationControl.valueChanges.pipe(
      // startWith([this.locationControl.value]),
      debounceTime(500),
      switchMap((value) => this.loadLocationOptions(value))
    );
  }

  private loadLocationOptions(value: string | atlas.Models.SearchFuzzyResult) {
    
    if (!value || typeof value !== 'string') {
      return from([[]]);
    }
    return from(
      this.searchClient.searchFuzzy(atlas.Aborter.timeout(10000), value)
    ).pipe(map((response) => response.results ?? []));
  }

  public optionDisplay(option: atlas.Models.SearchFuzzyResult | string) {
    if (typeof option === 'string') return option;
    return (
      (option?.type === 'POI'
        ? option?.poi?.name
        : option?.address?.freeformAddress) ?? ''
    );
  }

  registerOnChange(fn: (v: atlas.Models.SearchFuzzyResult) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.locationControl.disable();
    } else {
      this.locationControl.enable();
    }
  }

  writeValue(obj: never): void {
    this.locationControl.setValue(obj);
  }
}
