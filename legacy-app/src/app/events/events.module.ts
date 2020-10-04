/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../shared/shared.module';
import { RefundDialogComponent } from './components/refund-dialog/refund-dialog.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EventDetailsDisplayComponent } from './event-details-page/event-details-display/event-details-display.component';
import { EventDetailsPageComponent } from './event-details-page/event-details-page.component';
import { EventListPageComponent } from './event-list-page/event-list-page.component';
import { EventListComponent } from './event-list-page/event-list/event-list.component';
import { LoadEventsGuard } from './guards/load-events.guard';
import { SelectEventGuard } from './guards/select-event.guard';
import { RegisteredListComponent } from './registered-list/registered-list.component';
import { AppointmentsPageComponent } from './appointments-page/appointments-page.component';

const routes: Routes = [
  {
    path: 'list',
    data: { title: 'Events', animation: 'EventList' },
    canActivate: [LoadEventsGuard],
    component: EventListPageComponent,
  },
  {
    path: 'appointments',
    data: { title: 'Appointments', animation: 'EventList' },
    canActivate: [LoadEventsGuard],
    component: AppointmentsPageComponent,
  },
  {
    path: 'show/:eventId',
    data: { title: 'Event', animation: 'EventDetail' },
    component: EventDetailsPageComponent,
    canActivate: [SelectEventGuard],
  },
  { path: 'my', data: { title: 'My' }, component: RegisteredListComponent, canActivate: [AngularFireAuthGuard] },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    EventListPageComponent,
    EventListComponent,
    RegisteredListComponent,
    EventDetailsPageComponent,
    UserProfileComponent,
    EventDetailsDisplayComponent,
    RefundDialogComponent,
    AppointmentsPageComponent,
  ],
  entryComponents: [RefundDialogComponent],
  providers: [SelectEventGuard, LoadEventsGuard],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MarkdownModule.forChild()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventsModule {}
