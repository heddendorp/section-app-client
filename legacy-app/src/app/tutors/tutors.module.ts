import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RunEventsPageComponent } from './run-events-page/run-events-page.component';
import { TutorListPageComponent } from './tutor-list-page/tutor-list-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'list', component: TutorListPageComponent },
  { path: 'events', component: RunEventsPageComponent }
];

@NgModule({
  declarations: [RunEventsPageComponent, TutorListPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class TutorsModule {}
