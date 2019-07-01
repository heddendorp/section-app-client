import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'office', loadChildren: () => import('./office/office.module').then(mod => mod.OfficeModule) },
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  { path: '**', pathMatch: 'full', redirectTo: 'error' },
  { path: 'error', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
