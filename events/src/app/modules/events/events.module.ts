import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { SharedModule } from '../shared/shared.module';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { EventHeaderComponent } from './components/event-details/event-header/event-header.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    EventsComponent,
    EventListPageComponent,
    EventCardComponent,
    EventDetailsPageComponent,
    EventHeaderComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ],
})
export class EventsModule {}
