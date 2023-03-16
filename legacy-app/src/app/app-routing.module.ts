import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';
import { MemberGuard } from '@tumi/legacy-app/guards/member.guard';
import { PageNotFoundComponent } from '@tumi/legacy-app/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'about', pathMatch: 'full', redirectTo: 'page/about' },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'event-templates',
    canActivate: [AuthGuard, MemberGuard],
    loadChildren: () =>
      import('./modules/event-templates/event-templates.module').then(
        (m) => m.EventTemplatesModule
      ),
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./modules/events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'tenant',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./modules/tenant/tenant.module').then((m) => m.TenantModule),
  },
  {
    path: 'page',
    loadChildren: () =>
      import('./modules/page/page.module').then((m) => m.PageModule),
  },
  {
    path: 'tutor-hub',
    canActivate: [AuthGuard, MemberGuard],
    loadChildren: () =>
      import('./modules/tutor-hub/tutor-hub.module').then(
        (m) => m.TutorHubModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
