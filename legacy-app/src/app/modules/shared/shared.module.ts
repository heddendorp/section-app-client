import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { IfRoleDirective } from './directives/if-role.directive';
import { IfStatusDirective } from './directives/if-status.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataItemsCollectorComponent } from './components/data-items-collector/data-items-collector.component';
import { DataItemsManagerComponent } from './components/data-items-manager/data-items-manager.component';
import { GridComponent } from './components/grid/grid.component';
import { IconToastComponent } from './components/icon-toast/icon-toast.component';
import { LocationAutocompleteComponent } from './components/location-autocomplete/location-autocomplete.component';
import { MarkdownFieldComponent } from './components/markdown-field/markdown-field.component';
import { PhotoDetailsDialogComponent } from './components/photo-details-dialog/photo-details-dialog.component';
import { SelectLocationDialogComponent } from './components/select-location-dialog/select-location-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NewDataItemDialogComponent } from './components/new-data-item-dialog/new-data-item-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectWithAutocompleteDialogComponent } from './components/select-with-autocomplete-dialog/select-with-autocomplete-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MarkdownModule } from 'ngx-markdown';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    IfRoleDirective,
    IfStatusDirective,
    DataItemsCollectorComponent,
    DataItemsManagerComponent,
    GridComponent,
    IconToastComponent,
    LocationAutocompleteComponent,
    MarkdownFieldComponent,
    PhotoDetailsDialogComponent,
    SelectLocationDialogComponent,
    ExtendDatePipe,
    IconURLPipe,
    NewDataItemDialogComponent,
    SelectWithAutocompleteDialogComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MarkdownModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
  ],
  exports: [
    DataItemsCollectorComponent,
    DataItemsManagerComponent,
    ExtendDatePipe,
    FlexLayoutModule,
    GridComponent,
    IconToastComponent,
    IconURLPipe,
    IfRoleDirective,
    IfStatusDirective,
    LocationAutocompleteComponent,
    MarkdownFieldComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    PhotoDetailsDialogComponent,
    SelectLocationDialogComponent,
  ],
  providers: [DatePipe],
})
export class SharedModule {
  constructor(registry: MatIconRegistry, san: DomSanitizer) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl('./assets/icons/tumi.min.svg')
    );
  }
}
