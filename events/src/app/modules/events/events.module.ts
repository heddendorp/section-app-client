import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [EventsComponent, EventListPageComponent, EventCardComponent],
  imports: [CommonModule, EventsRoutingModule, SharedModule],
})
export class EventsModule {}
