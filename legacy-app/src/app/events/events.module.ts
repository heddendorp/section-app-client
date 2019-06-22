import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventListPageComponent } from './event-list-page/event-list-page.component';
import { NewEventPageComponent } from './new-event-page/new-event-page.component';
import { EventListComponent } from './event-list-page/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';
import { RegisteredListComponent } from './registered-list/registered-list.component';

const routes: Routes = [
  { path: 'events', component: EventListPageComponent },
  { path: 'my-events', component: RegisteredListComponent }
];

@NgModule({
  declarations: [EventListPageComponent, NewEventPageComponent, EventListComponent, RegisteredListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class EventsModule {}
