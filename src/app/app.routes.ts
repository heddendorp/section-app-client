import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { MemberGuard } from '@tumi/legacy-app/guards/member.guard';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';
import { globalAdminGuard } from '@tumi/legacy-app/guards/global-admin.guard';
import { contractEndGuard } from '@tumi/legacy-app/guards/contract-end.guard';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'about', pathMatch: 'full', redirectTo: 'page/about' },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'event-templates',
    canActivate: [contractEndGuard, AuthGuard, MemberGuard],
    loadChildren: () =>
      import('./modules/event-templates/event-templates.routes').then(
        (m) => m.EVENT_TEMPLATE_ROUTES,
      ),
  },
  {
    path: 'events',
    canActivate: [contractEndGuard],
    loadChildren: () =>
      import('./modules/events/events.routes').then((m) => m.EVENT_ROUTES),
  },
  {
    path: 'tenant',
    canActivate: [contractEndGuard, AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./modules/tenant/tenant.routes').then((m) => m.TENANT_ROUTES),
  },
  {
    path: 'settings',
    canActivate: [contractEndGuard, AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./modules/settings/settings.routes').then(
        (m) => m.SETTINGS_ROUTES,
      ),
  },
  {
    path: 'page',
    loadChildren: () =>
      import('./modules/page/page.routes').then((m) => m.PAGE_ROUTES),
  },
  {
    path: 'section-hub',
    canActivate: [contractEndGuard, AuthGuard, MemberGuard],
    loadChildren: () =>
      import('./modules/tutor-hub/tutor-hub.routes').then(
        (m) => m.TUTOR_HUB_ROUTES,
      ),
  },
  {
    path: 'global-admin',
    canActivate: [AuthGuard, globalAdminGuard],
    loadChildren: () =>
      import('./modules/global-admin/globalAdmin.routes').then(
        (m) => m.GLOBAL_ADMIN_ROUTES,
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'expired',
    loadComponent: () =>
      import('./components/expired-page/expired-page.component').then(
        (m) => m.ExpiredPageComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
  },
];
