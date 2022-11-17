import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { IfRoleDirective } from './directives/if-role.directive';
import { IfStatusDirective } from './directives/if-status.directive';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataItemsCollectorComponent } from './components/data-items-collector/data-items-collector.component';
import { DataItemsManagerComponent } from './components/data-items-manager/data-items-manager.component';
import { GridComponent } from './components/grid/grid.component';
import { IconToastComponent } from './components/icon-toast/icon-toast.component';
import { LocationAutocompleteComponent } from './components/location-autocomplete/location-autocomplete.component';
import { MarkdownFieldComponent } from './components/markdown-field/markdown-field.component';
import { PhotoDetailsDialogComponent } from './components/photo-details-dialog/photo-details-dialog.component';
import { SelectLocationDialogComponent } from './components/select-location-dialog/select-location-dialog.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { NewDataItemDialogComponent } from './components/new-data-item-dialog/new-data-item-dialog.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SelectWithAutocompleteDialogComponent } from './components/select-with-autocomplete-dialog/select-with-autocomplete-dialog.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MarkdownModule } from 'ngx-markdown';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule } from '@angular/common/http';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { RatingItemComponent } from './components/rating-item/rating-item.component';
import { RouterModule } from '@angular/router';
import { RateEventComponent } from './components/rate-event/rate-event.component';
import { RatingComponent } from './components/rating/rating.component';
import { UserChipComponent } from './components/user-chip/user-chip.component';
import { EventChipComponent } from './components/event-chip/event-chip.component';
import { MatRippleModule } from '@angular/material/core';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ReactiveToolbarComponent } from './components/reactive-toolbar/reactive-toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResetScrollDirective } from './directives/reset-scroll.directive';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { SnakeCasePipe } from '@tumi/legacy-app/modules/shared/pipes/snake-case.pipe';

@NgModule({
  declarations: [
    IfRoleDirective,
    IfStatusDirective,
    ResetScrollDirective,
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
    RatingItemComponent,
    RateEventComponent,
    RatingComponent,
    UserChipComponent,
    EventChipComponent,
    EventListItemComponent,
    ReactiveToolbarComponent,
    FooterComponent,
    TransactionListComponent,
    BackButtonComponent,
    SnakeCasePipe,
  ],
  imports: [
    RouterModule,
    CommonModule,
    MarkdownModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    MatRippleModule,
    MatTooltipModule,
  ],
  exports: [
    DataItemsCollectorComponent,
    DataItemsManagerComponent,
    ExtendDatePipe,
    GridComponent,
    IconToastComponent,
    IconURLPipe,
    IfRoleDirective,
    IfStatusDirective,
    ResetScrollDirective,
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
    RatingItemComponent,
    RateEventComponent,
    RatingComponent,
    UserChipComponent,
    EventChipComponent,
    EventListItemComponent,
    ReactiveToolbarComponent,
    FooterComponent,
    TransactionListComponent,
    BackButtonComponent,
    SnakeCasePipe,
  ],
  providers: [DatePipe, ExtendDatePipe],
})
export class SharedModule {
  constructor(registry: MatIconRegistry, san: DomSanitizer) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl('./assets/icons/tumi.min.svg')
    );
  }
}
