import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventListPageComponent, ViewEventPageComponent } from './containers';
import { SharedModule } from '../shared';
import {
  ExternalRegistrationComponent,
  OfficeRegistrationComponent,
  OnlineRegistrationComponent,
  TutorRegistrationComponent,
} from './components';
import { EventParticipantsComponent } from './components/event-participants/event-participants.component';
import { AnonymousRegistrationComponent } from './components/anonymous-registration/anonymous-registration.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventFormDialogComponent } from './components';
import { CollectMoneyComponent } from './components/collect-money/collect-money.component';

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
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    MatExpansionModule,
  ],
})
export class EventsModule {}
