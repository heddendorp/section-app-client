import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { EventEditPageComponent } from './pages/event-edit-page/event-edit-page.component';
import { EventRunPageComponent } from './pages/event-run-page/event-run-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: EventListPageComponent },
      { path: ':eventId', component: EventDetailsPageComponent },
      { path: ':eventId/edit', component: EventEditPageComponent },
      { path: ':eventId/run', component: EventRunPageComponent },
    ]),
  ],
  declarations: [
    EventListPageComponent,
    EventDetailsPageComponent,
    EventEditPageComponent,
    EventRunPageComponent,
  ],
})
export class UiEventsModule {}
