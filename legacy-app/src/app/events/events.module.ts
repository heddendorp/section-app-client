import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventListPageComponent } from './event-list-page/event-list-page.component';
import { EventListComponent } from './event-list-page/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';
import { RegisteredListComponent } from './registered-list/registered-list.component';
import { EventSignupDialogComponent } from './event-signup-dialog/event-signup-dialog.component';
import { EventDetailsPageComponent } from './event-details-page/event-details-page.component';

const routes: Routes = [
  { path: 'list', component: EventListPageComponent },
  { path: 'show/:eventId', component: EventDetailsPageComponent },
  { path: 'my', component: RegisteredListComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    EventListPageComponent,
    EventListComponent,
    RegisteredListComponent,
    EventSignupDialogComponent,
    EventDetailsPageComponent
  ],
  entryComponents: [EventSignupDialogComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class EventsModule {}
