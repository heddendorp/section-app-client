import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListPageComponent, ViewEventPageComponent } from './containers';
import { EventDataResolver } from './services/event-data.resolver';

const routes: Routes = [
  { path: '', component: EventListPageComponent },
  {
    path: ':id',
    component: ViewEventPageComponent,
    resolve: { event: EventDataResolver },
  },
  { path: 'list', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
