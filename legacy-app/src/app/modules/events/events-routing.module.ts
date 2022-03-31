import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { EventManagePageComponent } from '@tumi/legacy-app/modules/events/pages/event-manage-page/event-manage-page.component';
import { EventEditPageComponent } from '@tumi/legacy-app/modules/events/pages/event-edit-page/event-edit-page.component';
import { EventRunPageComponent } from '@tumi/legacy-app/modules/events/pages/event-run-page/event-run-page.component';
import { EventPhotoPageComponent } from '@tumi/legacy-app/modules/events/pages/event-photo-page/event-photo-page.component';
import { EventCheckinPageComponent } from '@tumi/legacy-app/modules/events/pages/event-checkin-page/event-checkin-page.component';
import { EventReceiptsPageComponent } from '@tumi/legacy-app/modules/events/pages/event-receipts-page/event-receipts-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  { path: ':eventId', component: EventDetailsPageComponent },
  {
    path: ':eventId/edit',
    canActivate: [AuthGuard],
    component: EventEditPageComponent,
  },
  {
    path: ':eventId/run',
    canActivate: [AuthGuard],
    component: EventRunPageComponent,
  },
  {
    path: ':eventId/run/scan',
    canActivate: [AuthGuard],
    component: EventCheckinPageComponent,
  },
  {
    path: ':eventId/photos',
    canActivate: [AuthGuard],
    component: EventPhotoPageComponent,
  },
  {
    path: ':eventId/run/receipts/:costItemId',
    canActivate: [AuthGuard],
    component: EventReceiptsPageComponent,
  },
  {
    path: ':eventId/manage',
    canActivate: [AuthGuard],
    component: EventManagePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
