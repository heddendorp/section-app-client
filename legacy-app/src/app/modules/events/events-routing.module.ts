import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { PublicRegistrationCodesPageComponent } from './pages/public-registration-codes-page/public-registration-codes-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  {
    path: ':selectedView',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  {
    path: ':selectedView/:year/:month',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  {
    path: 'codes',
    canActivate: [AuthGuard],
    component: PublicRegistrationCodesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
