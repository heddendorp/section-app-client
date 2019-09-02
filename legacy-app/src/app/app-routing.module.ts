import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'office', loadChildren: () => import('./office/office.module').then(mod => mod.OfficeModule) },
  { path: 'tutors', loadChildren: () => import('./tutors/tutors.module').then(mod => mod.TutorsModule) },
  { path: 'events', loadChildren: () => import('./events/events.module').then(mod => mod.EventsModule) },
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  { path: '**', pathMatch: 'full', redirectTo: 'error' },
  { path: 'error', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
