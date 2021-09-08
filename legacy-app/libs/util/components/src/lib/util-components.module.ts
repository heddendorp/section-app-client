import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationAutocompleteComponent } from './components/location-autocomplete/location-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  declarations: [LocationAutocompleteComponent],
  exports: [LocationAutocompleteComponent],
})
export class UtilComponentsModule {}
