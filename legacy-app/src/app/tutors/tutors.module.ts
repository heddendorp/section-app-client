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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../shared/shared.module';
import { LoadTutoredEventDetailsGuard } from './guards/load-tutored-event-details.guard';
import { LoadTutoredEventsGuard } from './guards/load-tutored-events.guard';
import { LoadFullEventResolver } from './resolvers/load-full-event.resolver';
import { DisplayEventInfoComponent } from './run-events-page/manage-event/display-event-info/display-event-info.component';
import { DisplayEventUsersComponent } from './run-events-page/manage-event/display-event-users/display-event-users.component';
import { ManageEventComponent } from './run-events-page/manage-event/manage-event.component';
import { RunEventsPageComponent } from './run-events-page/run-events-page.component';
import { TutorListPageComponent } from './tutor-list-page/tutor-list-page.component';
import { TutorShopPageComponent } from './tutor-shop-page/tutor-shop-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'list', component: TutorListPageComponent },
  { path: 'shop', component: TutorShopPageComponent },
  { path: 'events', component: RunEventsPageComponent, canActivate: [LoadTutoredEventsGuard] },
  { path: 'events/:eventId', component: ManageEventComponent, canActivate: [LoadTutoredEventDetailsGuard] },
];

@NgModule({
  declarations: [
    RunEventsPageComponent,
    TutorListPageComponent,
    ManageEventComponent,
    DisplayEventInfoComponent,
    DisplayEventUsersComponent,
    TutorShopPageComponent,
  ],
  providers: [LoadFullEventResolver, LoadTutoredEventsGuard, LoadTutoredEventDetailsGuard],
  imports: [CommonModule, RouterModule.forChild(routes), MarkdownModule.forChild(), SharedModule],
})
export class TutorsModule {}
