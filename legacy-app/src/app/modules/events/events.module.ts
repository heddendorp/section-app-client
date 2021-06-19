import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventListPageComponent, ViewEventPageComponent } from './containers';
import { SharedModule } from '../shared';
import {
  EventFormDialogComponent,
  ExternalRegistrationComponent,
  OfficeRegistrationComponent,
  OnlineRegistrationComponent,
  TutorRegistrationComponent,
} from './components';
import {
  AnonymousRegistrationComponent,
  CollectMoneyComponent,
  EventOrganizerComponent,
  EventParticipantsComponent,
  PayPalRegistrationComponent,
  StripeRegistrationComponent,
} from '@tumi/modules/events/components';
import { NgxPayPalModule } from 'ngx-paypal';
import { AttendanceDialogComponent } from '@tumi/modules/events/components/view-event/attendance-dialog/attendance-dialog.component';
import { EventFinancesComponent } from '@tumi/modules/events/containers';
import { EventAttendanceComponent } from '@tumi/modules/events/containers';
import { ParticipantComponent } from './components/event-attendance/participant/participant.component';
import { MatCardModule } from '@angular/material/card';
import { GetDownloadURLPipeModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    EventListPageComponent,
    ViewEventPageComponent,
    OnlineRegistrationComponent,
    OfficeRegistrationComponent,
    TutorRegistrationComponent,
    ExternalRegistrationComponent,
    EventParticipantsComponent,
    AnonymousRegistrationComponent,
    EventFormDialogComponent,
    CollectMoneyComponent,
    PayPalRegistrationComponent,
    EventOrganizerComponent,
    StripeRegistrationComponent,
    AttendanceDialogComponent,
    EventFinancesComponent,
    EventAttendanceComponent,
    ParticipantComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    NgxPayPalModule,
    MatCardModule,
    GetDownloadURLPipeModule,
  ],
})
export class EventsModule {}
