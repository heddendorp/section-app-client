import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPageComponent } from './event-page/event-page.component';
import { EventTableComponent } from './event-page/event-table/event-table.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SignupPageComponent } from './event-page/signup-page/signup-page.component';
import { EventEditPageComponent } from './event-page/event-edit-page/event-edit-page.component';
import { PeoplePageComponent } from './people-page/people-page.component';
import { PeopleTableComponent } from './people-page/people-table/people-table.component';
import { OfficeComponent } from './office.component';

const routes: Routes = [
  {
    path: 'office',
    component: OfficeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'events' },
      { path: 'people', component: PeoplePageComponent },
      {
        path: 'events',
        component: EventPageComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'signup' },
          { path: 'edit/:id', component: EventEditPageComponent },
          { path: 'signup', component: SignupPageComponent }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    EventPageComponent,
    EventTableComponent,
    SignupPageComponent,
    EventEditPageComponent,
    PeoplePageComponent,
    PeopleTableComponent,
    OfficeComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class OfficeModule {}
