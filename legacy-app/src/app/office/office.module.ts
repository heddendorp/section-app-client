/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CsvInputDialogComponent } from './components/csv-input-dialog/csv-input-dialog.component';
import { PeopleTableComponent } from './components/people-table/people-table.component';
import { EventEditFormComponent } from './event-page/event-edit-page/event-edit-form/event-edit-form.component';
import { EventEditPageComponent } from './event-page/event-edit-page/event-edit-page.component';
import { EventPageComponent } from './event-page/event-page.component';
import { EventTableComponent } from './event-page/event-table/event-table.component';
import { SignupPageComponent } from './event-page/signup-page/signup-page.component';
import { FundsPageComponent } from './funds-page/funds-page.component';
import { OfficeComponent } from './office.component';
import { LoadUserdataResolver } from './resolvers/load-userdata.resolver';
import { PDFService } from './services/pdf.service';
import { EditUserPageComponent } from './users-page/edit-user-page/edit-user-page.component';
import { ShowUserdataComponent } from './users-page/edit-user-page/show-userdata/show-userdata.component';
import { ShowUsereventsComponent } from './users-page/edit-user-page/show-userevents/show-userevents.component';
import { UsersPageComponent } from './users-page/users-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'users', component: UsersPageComponent },
  { path: 'users/:userId', component: EditUserPageComponent, resolve: [LoadUserdataResolver] },
  { path: 'funds', component: FundsPageComponent },
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
    FundsPageComponent,
    CsvInputDialogComponent,
    PeopleTableComponent,
    UsersPageComponent,
    EditUserPageComponent,
    ShowUserdataComponent,
    ShowUsereventsComponent
  ],
  providers: [LoadUserdataResolver, PDFService],
  entryComponents: [CsvInputDialogComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class OfficeModule {}
