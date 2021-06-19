import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '@tumi/modules/events/services/authentication.guard';
import {
  EventAttendanceComponent,
  EventFinancesComponent,
  EventListPageComponent,
  ViewEventPageComponent,
} from './containers';
import { EventDataResolver } from './services/event-data.resolver';

const routes: Routes = [
  { path: '', component: EventListPageComponent },
  {
    path: ':id/finances',
    component: EventFinancesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: ':id/attendance',
    component: EventAttendanceComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: ':id',
    component: ViewEventPageComponent,
    canActivate: [AuthenticationGuard],
    resolve: { event: EventDataResolver },
  },
  { path: 'list', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
