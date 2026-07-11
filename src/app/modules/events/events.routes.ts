import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CheckEventIdGuard } from '@tumi/legacy-app/modules/events/guards/check-event-id.guard';
import { MemberGuard } from '@tumi/legacy-app/guards/member.guard';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';
import { loadEventResolver } from '@tumi/legacy-app/modules/events/new-events/event-display/load-event.resolver';

const loadEventListPage = () =>
  import('./pages/event-list-page/event-list-page.component').then(
    (m) => m.EventListPageComponent,
  );
const loadEventDetailsPage = () =>
  import('./pages/event-details-page/event-details-page.component').then(
    (m) => m.EventDetailsPageComponent,
  );
const loadEventEditPage = () =>
  import('./pages/event-edit-page/event-edit-page.component').then(
    (m) => m.EventEditPageComponent,
  );
const loadEventRunPage = () =>
  import('./pages/event-run-page/event-run-page.component').then(
    (m) => m.EventRunPageComponent,
  );
const loadEventCheckinPage = () =>
  import('./pages/event-checkin-page/event-checkin-page.component').then(
    (m) => m.EventCheckinPageComponent,
  );
const loadEventPhotoPage = () =>
  import('./pages/event-photo-page/event-photo-page.component').then(
    (m) => m.EventPhotoPageComponent,
  );
const loadEventReceiptsPage = () =>
  import('./pages/event-receipts-page/event-receipts-page.component').then(
    (m) => m.EventReceiptsPageComponent,
  );
const loadEventManagePage = () =>
  import('./pages/event-manage-page/event-manage-page.component').then(
    (m) => m.EventManagePageComponent,
  );

const newUI = !!localStorage.getItem('evorto_new_ui');
export const EVENT_ROUTES: Routes = newUI
  ? [
      {
        path: '',
        loadComponent: () =>
          import('./new-events/event-list-shell/event-list-shell.component').then(
            (m) => m.EventListShellComponent,
          ),
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
                  import('./new-events/event-display/event-display.component').then(
                    (m) => m.EventDisplayComponent,
                  ),
              },
              {
                path: 'checkin',
                canActivate: [AuthGuard],
                loadComponent: loadEventDetailsPage,
              },
              {
                path: 'edit',
                canActivate: [AuthGuard, MemberGuard],
                loadComponent: loadEventEditPage,
              },
              {
                path: 'run',
                canActivate: [AuthGuard, MemberGuard],
                loadComponent: loadEventRunPage,
              },
              {
                path: 'run/scan',
                canActivate: [AuthGuard, MemberGuard],
                loadComponent: loadEventCheckinPage,
              },
              {
                path: 'photos',
                canActivate: [AuthGuard],
                loadComponent: loadEventPhotoPage,
              },
              {
                path: 'run/receipts/:costItemId',
                canActivate: [AuthGuard, MemberGuard],
                loadComponent: loadEventReceiptsPage,
                title: 'Receipts',
              },
              {
                path: 'manage',
                canActivate: [AuthGuard, AdminGuard],
                loadComponent: loadEventManagePage,
              },
            ],
          },
        ],
      },
      {
        path: 'codes',
        canActivate: [AuthGuard],
        loadComponent: loadEventListPage,
        title: 'Events',
      },
    ]
  : [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: loadEventListPage,
        title: 'Events',
      },
      {
        path: 'list',
        pathMatch: 'full',
        loadComponent: loadEventListPage,
        title: 'Events',
      },
      {
        path: 'list/:year/:month',
        pathMatch: 'full',
        loadComponent: loadEventListPage,
        title: 'Events',
      },
      {
        path: 'calendar',
        pathMatch: 'full',
        loadComponent: loadEventListPage,
        title: 'Events',
      },
      {
        path: 'calendar/:year/:month',
        pathMatch: 'full',
        loadComponent: loadEventListPage,
        title: 'Events',
      },
      {
        path: 'codes',
        canActivate: [AuthGuard],
        loadComponent: loadEventListPage,
        title: 'Events',
      },
      {
        path: ':eventId',
        canActivate: [CheckEventIdGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: loadEventDetailsPage,
          },
          {
            path: 'checkin',
            canActivate: [AuthGuard],
            loadComponent: loadEventDetailsPage,
          },
          {
            path: 'edit',
            canActivate: [AuthGuard, MemberGuard],
            loadComponent: loadEventEditPage,
          },
          {
            path: 'run',
            canActivate: [AuthGuard, MemberGuard],
            loadComponent: loadEventRunPage,
          },
          {
            path: 'run/scan',
            canActivate: [AuthGuard, MemberGuard],
            loadComponent: loadEventCheckinPage,
          },
          {
            path: 'photos',
            canActivate: [AuthGuard],
            loadComponent: loadEventPhotoPage,
          },
          {
            path: 'run/receipts/:costItemId',
            canActivate: [AuthGuard, MemberGuard],
            loadComponent: loadEventReceiptsPage,
            title: 'Receipts',
          },
          {
            path: 'manage',
            canActivate: [AuthGuard, AdminGuard],
            loadComponent: loadEventManagePage,
          },
        ],
      },
    ];
