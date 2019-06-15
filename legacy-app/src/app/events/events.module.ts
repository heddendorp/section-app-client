import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventListPageComponent } from './event-list-page/event-list-page.component';
import { NewEventPageComponent } from './new-event-page/new-event-page.component';
import { EventListComponent } from './event-list-page/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: 'events', component: EventListPageComponent }];

@NgModule({
  declarations: [EventListPageComponent, NewEventPageComponent, EventListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class EventsModule {}
