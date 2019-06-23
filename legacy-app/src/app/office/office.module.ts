import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPageComponent } from './event-page/event-page.component';
import { EventTableComponent } from './event-page/event-table/event-table.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SignupPageComponent } from './event-page/signup-page/signup-page.component';
import { EventEditPageComponent } from './event-page/event-edit-page/event-edit-page.component';
import { OfficeComponent } from './office.component';
import { EventEditFormComponent } from './event-page/event-edit-page/event-edit-form/event-edit-form.component';
import { StudentsPageComponent } from './students-page/students-page.component';
import { TutorsPageComponent } from './tutors-page/tutors-page.component';
import { FundsPageComponent } from './funds-page/funds-page.component';
import { CsvInputDialogComponent } from './components/csv-input-dialog/csv-input-dialog.component';
import { PeopleTableComponent } from './components/people-table/people-table.component';
import { RequestsPageComponent } from './requests-page/requests-page.component';
import { EditRequestPageComponent } from './requests-page/edit-request-page/edit-request-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'students', component: StudentsPageComponent },
  { path: 'tutors', component: TutorsPageComponent },
  { path: 'funds', component: FundsPageComponent },
  {
    path: 'requests',
    component: RequestsPageComponent,
    children: [{ path: 'edit/:requestId', component: EditRequestPageComponent }]
  },
  { path: 'events', component: EventPageComponent },
  { path: 'events/edit/:id', component: EventEditPageComponent }
];

@NgModule({
  declarations: [
    EventPageComponent,
    EventTableComponent,
    SignupPageComponent,
    EventEditPageComponent,
    OfficeComponent,
    EventEditFormComponent,
    StudentsPageComponent,
    TutorsPageComponent,
    FundsPageComponent,
    CsvInputDialogComponent,
    PeopleTableComponent,
    RequestsPageComponent,
    EditRequestPageComponent
  ],
  entryComponents: [CsvInputDialogComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class OfficeModule {}
