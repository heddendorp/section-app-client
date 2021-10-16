import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { EventEditPageComponent } from './pages/event-edit-page/event-edit-page.component';
import { EventRunPageComponent } from './pages/event-run-page/event-run-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilPipesModule } from '@tumi/util/pipes';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';
import { EventHeaderComponent } from './components/event-header/event-header.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { UtilComponentsModule } from '@tumi/util-components';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilMaterialModule } from '@tumi/util/material';
import { AuthGuard } from '@auth0/auth0-angular';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UiAuthModule } from '@tumi/ui-auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectOrganizerDialogComponent } from './components/select-organizer-dialog/select-organizer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExternalEventRegistrationComponent } from './components/registration/external-event-registration/external-event-registration.component';
import { StripeRegistrationComponent } from './components/registration/stripe-registration/stripe-registration.component';
import { OnlineEventRegistrationComponent } from './components/registration/online-event-registration/online-event-registration.component';
import { EventManagePageComponent } from './pages/event-manage-page/event-manage-page.component';
import { ScanningDialogComponent } from './components/running/scanning-dialog/scanning-dialog.component';
import { QrDisplayDialogComponent } from './components/qr-display-dialog/qr-display-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MoveEventDialogComponent } from './components/move-event-dialog/move-event-dialog.component';
import { ManageEventFinancesComponent } from './components/management/manage-event-finances/manage-event-finances.component';
import { EventRunReceiptsPageComponent } from './pages/event-run-receipts-page/event-run-receipts-page.component';
import { AddReceiptDialogComponent } from './components/running/add-receipt-dialog/add-receipt-dialog.component';
import { EventSubmissionDialogComponent } from './components/editing/event-submission-dialog/event-submission-dialog.component';
import { EventPhotoPageComponent } from './pages/event-photo-page/event-photo-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: EventListPageComponent },
      { path: ':eventId', component: EventDetailsPageComponent },
      {
        path: ':eventId/edit',
        canActivate: [AuthGuard],
        component: EventEditPageComponent,
      },
      {
        path: ':eventId/run',
        canActivate: [AuthGuard],
        component: EventRunPageComponent,
      },
      {
        path: ':eventId/photos',
        canActivate: [AuthGuard],
        component: EventPhotoPageComponent,
      },
      {
        path: ':eventId/run/receipts/:costItemId',
        canActivate: [AuthGuard],
        component: EventRunReceiptsPageComponent,
      },
      {
        path: ':eventId/manage',
        canActivate: [AuthGuard],
        component: EventManagePageComponent,
      },
    ]),
    UtilPipesModule,
    UtilComponentsModule,
    UiAuthModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSnackBarModule,
    MarkdownModule.forChild(),
    UtilMaterialModule,
    MatListModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatExpansionModule,
    ClipboardModule,
  ],
  declarations: [
    EventListPageComponent,
    EventDetailsPageComponent,
    EventEditPageComponent,
    EventRunPageComponent,
    EventHeaderComponent,
    EventListComponent,
    EventListItemComponent,
    SelectOrganizerDialogComponent,
    ExternalEventRegistrationComponent,
    StripeRegistrationComponent,
    OnlineEventRegistrationComponent,
    EventManagePageComponent,
    ScanningDialogComponent,
    QrDisplayDialogComponent,
    MoveEventDialogComponent,
    ManageEventFinancesComponent,
    EventRunReceiptsPageComponent,
    AddReceiptDialogComponent,
    EventSubmissionDialogComponent,
    EventPhotoPageComponent,
  ],
})
export class UiEventsModule {}
