import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AboutPageComponent } from './about-page/about-page.component';
import { PaPageComponent } from './pa-page/pa-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';

const routes: Routes = [
  { path: 'about', data: { standalone: true }, component: AboutPageComponent },
  { path: 'party-animals', data: { standalone: true }, component: PaPageComponent },
  { path: 'signup', component: SignupPageComponent }
];

@NgModule({
  declarations: [AboutPageComponent, SignupPageComponent, PaPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class PagesModule {}
