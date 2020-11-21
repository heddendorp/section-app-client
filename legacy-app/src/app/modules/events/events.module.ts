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
import { EventParticipantsComponent } from './components/event-participants/event-participants.component';
import { AnonymousRegistrationComponent } from './components/anonymous-registration/anonymous-registration.component';
import { CollectMoneyComponent } from './components/collect-money/collect-money.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { PayPalRegistrationComponent } from './components/pay-pal-registration/pay-pal-registration.component';

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
  ],
  imports: [CommonModule, SharedModule, EventsRoutingModule, NgxPayPalModule],
})
export class EventsModule {}
