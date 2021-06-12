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
  ],
  imports: [CommonModule, SharedModule, EventsRoutingModule, NgxPayPalModule],
})
export class EventsModule {}
