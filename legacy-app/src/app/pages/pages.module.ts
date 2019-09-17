import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AboutPageComponent } from './about-page/about-page.component';
import { PaPageComponent } from './pa-page/pa-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { ImprintPageComponent } from './imprint-page/imprint-page.component';
import { DataPrivacyPageComponent } from './data-privacy-page/data-privacy-page.component';

const routes: Routes = [
  { path: 'about', data: { standalone: true, title: 'About' }, component: AboutPageComponent },
  { path: 'help', data: { title: 'Help' }, component: HelpPageComponent },
  { path: 'party-animals', data: { standalone: true, title: 'Party Animals' }, component: PaPageComponent },
  { path: 'signup', data: { title: 'Login' }, component: SignupPageComponent },
  { path: 'imprint', data: { title: 'Imprint' }, component: ImprintPageComponent },
  { path: 'data-privacy', data: { title: 'Privacy' }, component: DataPrivacyPageComponent }
];

@NgModule({
  declarations: [
    AboutPageComponent,
    SignupPageComponent,
    PaPageComponent,
    HelpPageComponent,
    ImprintPageComponent,
    DataPrivacyPageComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class PagesModule {}
