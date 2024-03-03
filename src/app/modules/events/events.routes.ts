import { Routes } from '@angular/router';
import { EventListPageComponent } from '@tumi/legacy-app/modules/events/pages/event-list-page/event-list-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { CheckEventIdGuard } from '@tumi/legacy-app/modules/events/guards/check-event-id.guard';
import { EventDetailsPageComponent } from '@tumi/legacy-app/modules/events/pages/event-details-page/event-details-page.component';
import { MemberGuard } from '@tumi/legacy-app/guards/member.guard';
import { EventEditPageComponent } from '@tumi/legacy-app/modules/events/pages/event-edit-page/event-edit-page.component';
import { EventRunPageComponent } from '@tumi/legacy-app/modules/events/pages/event-run-page/event-run-page.component';
import { EventCheckinPageComponent } from '@tumi/legacy-app/modules/events/pages/event-checkin-page/event-checkin-page.component';
import { EventPhotoPageComponent } from '@tumi/legacy-app/modules/events/pages/event-photo-page/event-photo-page.component';
import { EventReceiptsPageComponent } from '@tumi/legacy-app/modules/events/pages/event-receipts-page/event-receipts-page.component';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';
import { EventManagePageComponent } from '@tumi/legacy-app/modules/events/pages/event-manage-page/event-manage-page.component';
import { loadEventResolver } from '@tumi/legacy-app/modules/events/new-events/event-display/load-event.resolver';

const newUI = !!localStorage.getItem('evorto_new_ui');
export const EVENT_ROUTES: Routes = newUI
  ? [
      {
        path: '',
        loadComponent: () =>
          import(
            './new-events/event-list-shell/event-list-shell.component'
          ).then((m) => m.EventListShellComponent),
        title: 'Events',
        children: [
          {
            path: ':eventId',
            canActivate: [CheckEventIdGuard],
            children: [
              {
                path: '',
                resolve: {
                  event: loadEventResolver,
                },
                loadComponent: () =>
                  import(
                    './new-events/event-display/event-display.component'
                  ).then((m) => m.EventDisplayComponent),
              },
              {
                path: 'checkin',
                canActivate: [AuthGuard],
                component: EventDetailsPageComponent,
              },
              {
                path: 'edit',
                canActivate: [AuthGuard, MemberGuard],
                component: EventEditPageComponent,
              },
              {
                path: 'run',
                canActivate: [AuthGuard, MemberGuard],
                component: EventRunPageComponent,
              },
              {
                path: 'run/scan',
                canActivate: [AuthGuard, MemberGuard],
                component: EventCheckinPageComponent,
              },
              {
                path: 'photos',
                canActivate: [AuthGuard],
                component: EventPhotoPageComponent,
              },
              {
                path: 'run/receipts/:costItemId',
                canActivate: [AuthGuard, MemberGuard],
                component: EventReceiptsPageComponent,
                title: 'Receipts',
              },
              {
                path: 'manage',
                canActivate: [AuthGuard, AdminGuard],
                component: EventManagePageComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'codes',
        canActivate: [AuthGuard],
        component: EventListPageComponent,
        title: 'Events',
      },
    ]
  : [
      {
        path: '',
        pathMatch: 'full',
        component: EventListPageComponent,
        title: 'Events',
      },
      {
        path: 'list',
        pathMatch: 'full',
        component: EventListPageComponent,
        title: 'Events',
      },
      {
        path: 'list/:year/:month',
        pathMatch: 'full',
        component: EventListPageComponent,
        title: 'Events',
      },
      {
        path: 'calendar',
        pathMatch: 'full',
        component: EventListPageComponent,
        title: 'Events',
      },
      {
        path: 'calendar/:year/:month',
        pathMatch: 'full',
        component: EventListPageComponent,
        title: 'Events',
      },
      {
        path: 'codes',
        canActivate: [AuthGuard],
        component: EventListPageComponent,
        title: 'Events',
      },
      {
        path: ':eventId',
        canActivate: [CheckEventIdGuard],
        children: [
          { path: '', pathMatch: 'full', component: EventDetailsPageComponent },
          {
            path: 'checkin',
            canActivate: [AuthGuard],
            component: EventDetailsPageComponent,
          },
          {
            path: 'edit',
            canActivate: [AuthGuard, MemberGuard],
            component: EventEditPageComponent,
          },
          {
            path: 'run',
            canActivate: [AuthGuard, MemberGuard],
            component: EventRunPageComponent,
          },
          {
            path: 'run/scan',
            canActivate: [AuthGuard, MemberGuard],
            component: EventCheckinPageComponent,
          },
          {
            path: 'photos',
            canActivate: [AuthGuard],
            component: EventPhotoPageComponent,
          },
          {
            path: 'run/receipts/:costItemId',
            canActivate: [AuthGuard, MemberGuard],
            component: EventReceiptsPageComponent,
            title: 'Receipts',
          },
          {
            path: 'manage',
            canActivate: [AuthGuard, AdminGuard],
            component: EventManagePageComponent,
          },
        ],
      },
    ];
