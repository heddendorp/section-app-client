import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'office',
    loadChildren: () => import('./office/office.module').then(mod => mod.OfficeModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'tutors',
    loadChildren: () => import('./tutors/tutors.module').then(mod => mod.TutorsModule),
    canActivate: [AngularFireAuthGuard]
  },
  { path: 'events', loadChildren: () => import('./events/events.module').then(mod => mod.EventsModule) },
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: '**', pathMatch: 'full', redirectTo: 'error' },
  { path: 'error', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AngularFireAuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
