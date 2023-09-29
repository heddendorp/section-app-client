import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PROFILE_ROUTES } from '@tumi/legacy-app/modules/profile/profile.routes';
import { MemberGuard } from '@tumi/legacy-app/guards/member.guard';
import { EVENT_TEMPLATE_ROUTES } from '@tumi/legacy-app/modules/event-templates/event-templates.routes';
import { EVENT_ROUTES } from '@tumi/legacy-app/modules/events/events.routes';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';
import { TENANT_ROUTES } from '@tumi/legacy-app/modules/tenant/tenant.routes';
import { PAGE_ROUTES } from '@tumi/legacy-app/modules/page/page.routes';
import { TUTOR_HUB_ROUTES } from '@tumi/legacy-app/modules/tutor-hub/tutor-hub.routes';
import { HOME_ROUTES } from '@tumi/legacy-app/modules/home/home.routes';
import { PageNotFoundComponent } from '@tumi/legacy-app/components/page-not-found/page-not-found.component';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'about', pathMatch: 'full', redirectTo: 'page/about' },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: PROFILE_ROUTES,
  },
  {
    path: 'event-templates',
    canActivate: [AuthGuard, MemberGuard],
    children: EVENT_TEMPLATE_ROUTES,
  },
  {
    path: 'events',
    children: EVENT_ROUTES,
  },
  {
    path: 'tenant',
    canActivate: [AuthGuard, AdminGuard],
    children: TENANT_ROUTES,
  },
  {
    path: 'page',
    children: PAGE_ROUTES,
  },
  {
    path: 'section-hub',
    canActivate: [AuthGuard, MemberGuard],
    children: TUTOR_HUB_ROUTES,
  },
  {
    path: 'home',
    children: HOME_ROUTES,
  },
  { path: '**', component: PageNotFoundComponent },
];
