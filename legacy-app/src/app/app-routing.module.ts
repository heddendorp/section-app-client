import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from '@tumi/components';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: 'events',
        loadChildren: () =>
          import('./modules/events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'scanner',
        loadChildren: () =>
          import('./modules/scanner/scanner.module').then(
            (m) => m.ScannerModule
          ),
      },
      {
        path: 'money',
        loadChildren: () =>
          import('./modules/money/money.module').then((m) => m.MoneyModule),
      },
      {
        path: 'association',
        loadChildren: () =>
          import('./modules/association/association.module').then(
            (m) => m.AssociationModule
          ),
      },
      {
        path: 'apply',
        loadChildren: () =>
          import('./modules/applications/applications.module').then(
            (m) => m.ApplicationsModule
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'events' },
    ],
  },
  {
    path: 'page',
    loadChildren: () =>
      import('./modules/pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modules/about/about.module').then((m) => m.AboutModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '/page/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
