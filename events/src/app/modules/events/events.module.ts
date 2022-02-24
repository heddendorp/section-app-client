import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { SharedModule } from '../shared/shared.module';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { EventRegistrationComponent } from './components/event-details/event-registration/event-registration.component';

@NgModule({
  declarations: [
    EventListPageComponent,
    EventCardComponent,
    EventDetailsPageComponent,
    EventRegistrationComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ],
})
export class EventsModule {}
