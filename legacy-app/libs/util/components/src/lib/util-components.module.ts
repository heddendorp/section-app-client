import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationAutocompleteComponent } from './components/location-autocomplete/location-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from './components/grid/grid.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectLocationDialogComponent } from './components/select-location-dialog/select-location-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IconToastComponent } from './components/icon-toast/icon-toast.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilMaterialModule } from '@tumi/util/material';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    UtilMaterialModule,
  ],
  declarations: [
    LocationAutocompleteComponent,
    GridComponent,
    SelectLocationDialogComponent,
    IconToastComponent,
  ],
  exports: [
    LocationAutocompleteComponent,
    GridComponent,
    SelectLocationDialogComponent,
    IconToastComponent,
  ],
})
export class UtilComponentsModule {}
