import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  catchError,
  concat,
  debounceTime,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
} from '@angular/forms';
import * as atlas from 'azure-maps-rest';
import { HttpClient } from '@angular/common/http';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;
import AutocompleteService = google.maps.places.AutocompleteService;

@Component({
  selector: 'app-location-autocomplete',
  templateUrl: './location-autocomplete.component.html',
  styleUrls: ['./location-autocomplete.component.scss'],
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
  public locationControl = new UntypedFormControl();
  public locationOptions: Observable<AutocompletePrediction[]>;
  private apiLoaded$: Observable<boolean>;
  private sessionToken?: AutocompleteSessionToken;
  private autocompleteService?: AutocompleteService;

  private center = { lat: 48.137154, lng: 11.576124 };
  private defaultBounds = {
    north: this.center.lat + 0.1,
    south: this.center.lat - 0.1,
    east: this.center.lng + 0.1,
    west: this.center.lng - 0.1,
  };

  constructor(httpClient: HttpClient) {
    this.apiLoaded$ = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDl_a52BoC_ukP5FFDpTJh5puiKuayfr6A&libraries=places',
        'callback'
      )
      .pipe(
        map(() => true),
        tap(() => {
          this.autocompleteService =
            new google.maps.places.AutocompleteService();
          this.sessionToken = new google.maps.places.AutocompleteSessionToken();
        }),
        catchError((err) => {
          console.error(err);
          return of(false);
        })
      );
    this.locationOptions = concat(
      this.apiLoaded$.pipe(map(() => [])),
      this.locationControl.valueChanges.pipe(
        // startWith([this.locationControl.value]),
        debounceTime(500),
        switchMap((value) => this.loadLocationOptions(value))
      )
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (v: AutocompletePrediction) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: () => void = () => {};

  public optionDisplay(option: AutocompletePrediction | string) {
    if (!option) return '';
    if (typeof option === 'string') return option;
    return option.structured_formatting.main_text;
  }

  registerOnChange(fn: (v: AutocompletePrediction) => void): void {
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

  private loadLocationOptions(value: string | AutocompletePrediction) {
    if (!value || typeof value !== 'string') {
      return from([[]]);
    }
    if (!this.autocompleteService) return of([]);
    return from(
      this.autocompleteService.getPlacePredictions({
        input: value,
        sessionToken: this.sessionToken,
        bounds: this.defaultBounds,
      })
    ).pipe(map((res) => res.predictions ?? []));
  }
}
