import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventListPageComponent } from './event-list-page/event-list-page.component';
import { NewEventPageComponent } from './new-event-page/new-event-page.component';
import { EventListComponent } from './event-list-page/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';
import { RegisteredListComponent } from './registered-list/registered-list.component';
import { EventSignupDialogComponent } from './event-signup-dialog/event-signup-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
  { path: 'events', component: EventListPageComponent },
  { path: 'my-events', component: RegisteredListComponent }
];

@NgModule({
  declarations: [
    EventListPageComponent,
    NewEventPageComponent,
    EventListComponent,
    RegisteredListComponent,
    EventSignupDialogComponent
  ],
  entryComponents: [EventSignupDialogComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, QRCodeModule]
})
export class EventsModule {}
