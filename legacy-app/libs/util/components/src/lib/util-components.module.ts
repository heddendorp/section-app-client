import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationAutocompleteComponent } from './components/location-autocomplete/location-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from './components/grid/grid.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  declarations: [LocationAutocompleteComponent, GridComponent],
  exports: [LocationAutocompleteComponent, GridComponent],
})
export class UtilComponentsModule {}
