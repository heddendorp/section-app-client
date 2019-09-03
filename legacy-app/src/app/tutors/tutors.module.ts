import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RunEventsPageComponent } from './run-events-page/run-events-page.component';
import { TutorListPageComponent } from './tutor-list-page/tutor-list-page.component';
import { ManageEventComponent } from './run-events-page/manage-event/manage-event.component';
import { LoadFullEventResolver } from './resolvers/load-full-event.resolver';
import { DisplayEventInfoComponent } from './run-events-page/manage-event/display-event-info/display-event-info.component';
import { DisplayEventUsersComponent } from './run-events-page/manage-event/display-event-users/display-event-users.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'list', component: TutorListPageComponent },
  { path: 'events', component: RunEventsPageComponent },
  { path: 'events/:eventId', component: ManageEventComponent, resolve: [LoadFullEventResolver] }
];

@NgModule({
  declarations: [
    RunEventsPageComponent,
    TutorListPageComponent,
    ManageEventComponent,
    DisplayEventInfoComponent,
    DisplayEventUsersComponent
  ],
  providers: [LoadFullEventResolver],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class TutorsModule {}
