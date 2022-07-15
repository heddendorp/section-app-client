import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { EventEditPageComponent } from './pages/event-edit-page/event-edit-page.component';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventManagePageComponent } from './pages/event-manage-page/event-manage-page.component';
import { EventPhotoPageComponent } from './pages/event-photo-page/event-photo-page.component';
import { EventRunPageComponent } from './pages/event-run-page/event-run-page.component';
import { EventCheckinPageComponent } from './pages/event-checkin-page/event-checkin-page.component';
import { EventReceiptsPageComponent } from './pages/event-receipts-page/event-receipts-page.component';
import { EventHeaderComponent } from './components/event-header/event-header.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { MoveEventDialogComponent } from './components/move-event-dialog/move-event-dialog.component';
import { QrDisplayDialogComponent } from './components/qr-display-dialog/qr-display-dialog.component';
import { SelectOrganizerDialogComponent } from './components/select-organizer-dialog/select-organizer-dialog.component';
import { EventManageFinancesComponent } from './components/management/event-manage-finances/event-manage-finances.component';
import { EventManageVotingComponent } from './components/management/event-manage-voting/event-manage-voting.component';
import { CheckAdditionalDataComponent } from './components/registration/check-additional-data/check-additional-data.component';
import { CheckRegistrationTimeComponent } from './components/registration/check-registration-time/check-registration-time.component';
import { ExternalEventRegistrationComponent } from './components/registration/external-event-registration/external-event-registration.component';
import { OnlineEventRegistrationComponent } from './components/registration/online-event-registration/online-event-registration.component';
import { StripeEventRegistrationComponent } from './components/registration/stripe-event-registration/stripe-event-registration.component';
import { AddReceiptDialogComponent } from './components/running/add-receipt-dialog/add-receipt-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PublicRegistrationCodesPageComponent } from './pages/public-registration-codes-page/public-registration-codes-page.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventCalendarDayDialogComponent } from './components/event-calendar/event-calendar-day-dialog/event-calendar-day-dialog';

@NgModule({
  declarations: [
    EventDetailsPageComponent,
    EventEditPageComponent,
    EventListPageComponent,
    EventManagePageComponent,
    EventPhotoPageComponent,
    EventRunPageComponent,
    EventCheckinPageComponent,
    EventReceiptsPageComponent,
    EventHeaderComponent,
    EventListComponent,
    EventListItemComponent,
    MoveEventDialogComponent,
    QrDisplayDialogComponent,
    SelectOrganizerDialogComponent,
    EventManageFinancesComponent,
    EventManageVotingComponent,
    CheckAdditionalDataComponent,
    CheckRegistrationTimeComponent,
    ExternalEventRegistrationComponent,
    OnlineEventRegistrationComponent,
    StripeEventRegistrationComponent,
    AddReceiptDialogComponent,
    PublicRegistrationCodesPageComponent,
    EventCalendarComponent,
    EventCalendarDayDialogComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MatDatepickerModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MarkdownModule.forChild(),
    MatExpansionModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatSlideToggleModule,
  ],
})
export class EventsModule {}
