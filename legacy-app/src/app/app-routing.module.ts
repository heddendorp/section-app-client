import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminGuard } from '@tumi/legacy-app/guards/admin.guard';

const routes: Routes = [
  { path: 'about', pathMatch: 'full', redirectTo: 'page/about' },
  {
    path: 'profile',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'event-templates',
    canLoad: [AuthGuard],
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
    path: 'event',
    loadChildren: () =>
      import('./modules/event/event.module').then((m) => m.EventModule),
  },
  {
    path: 'tenant',
    canLoad: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./modules/tenant/tenant.module').then((m) => m.TenantModule),
  },
  {
    path: 'page',
    loadChildren: () =>
      import('./modules/page/page.module').then((m) => m.PageModule),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./modules/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'basket',
    loadChildren: () =>
      import('./modules/shopping-basket/shopping-basket.module').then(
        (m) => m.ShoppingBasketModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  { path: '**', redirectTo: 'events' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
