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
import { PublicRegistrationCodesPageComponent } from '@tumi/legacy-app/modules/events/pages/public-registration-codes-page/public-registration-codes-page.component';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';
import { MemberGuard } from '@tumi/legacy-app/guards/member.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  {
    path: 'calendar',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  {
    path: 'calendar/:year/:month',
    pathMatch: 'full',
    component: EventListPageComponent,
  },
  {
    path: 'codes',
    canActivate: [AuthGuard],
    component: PublicRegistrationCodesPageComponent,
  },
  { path: ':eventId', component: EventDetailsPageComponent },
  {
    path: ':eventId/edit',
    canActivate: [AuthGuard, MemberGuard],
    component: EventEditPageComponent,
  },
  {
    path: ':eventId/run',
    canActivate: [AuthGuard, MemberGuard],
    component: EventRunPageComponent,
  },
  {
    path: ':eventId/run/scan',
    canActivate: [AuthGuard, MemberGuard],
    component: EventCheckinPageComponent,
  },
  {
    path: ':eventId/photos',
    canActivate: [AuthGuard],
    component: EventPhotoPageComponent,
  },
  {
    path: ':eventId/run/receipts/:costItemId',
    canActivate: [AuthGuard, MemberGuard],
    component: EventReceiptsPageComponent,
  },
  {
    path: ':eventId/manage',
    canActivate: [AuthGuard, AdminGuard],
    component: EventManagePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
