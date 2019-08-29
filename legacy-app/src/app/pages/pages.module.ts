import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './about-page/about-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { PaPageComponent } from './pa-page/pa-page.component';

const routes: Routes = [
  { path: 'about', component: AboutPageComponent },
  { path: 'party-animals', component: PaPageComponent },
  { path: 'signup', component: SignupPageComponent }
];

@NgModule({
  declarations: [AboutPageComponent, SignupPageComponent, PaPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class PagesModule {}
