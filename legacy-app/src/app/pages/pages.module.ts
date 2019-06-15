import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './about-page/about-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: 'about', component: AboutPageComponent }];

@NgModule({
  declarations: [AboutPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class PagesModule {}
