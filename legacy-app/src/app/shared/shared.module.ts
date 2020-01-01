/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
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

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher, MatRippleModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { IconToastComponent } from './components/icon-toast/icon-toast.component';
import { UserDataChangeComponent } from './components/user-data-change/user-data-change.component';
import { ShowUntilDirective } from './directives/show-until.directive';
import { DegreePipe } from './services/degree.pipe';
import { FacultyPipe } from './services/faculty.pipe';
import { TypePipe } from './services/type.pipe';
import { AuthState } from './state/auth.state';
import { EventsState } from './state/events.state';
import { UsersState } from './state/users.state';

const materialModules = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatTableModule,
  MatInputModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatSortModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatSelectModule,
  MatExpansionModule,
  MatRippleModule,
  MatBadgeModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  ScrollingModule
];

@NgModule({
  imports: [
    CommonModule,
    materialModules,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([AuthState, EventsState, UsersState])
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { minWidth: '50vw', closeOnNavigation: true, disableClose: false, hasBackdrop: true }
    }
  ],
  exports: [
    materialModules,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    IconToastComponent,
    UserDataChangeComponent,
    FacultyPipe,
    DegreePipe,
    TypePipe,
    ShowUntilDirective
  ],
  declarations: [
    IconToastComponent,
    UserDataChangeComponent,
    FacultyPipe,
    TypePipe,
    DegreePipe,
    ConfirmationDialogComponent,
    ShowUntilDirective
  ],
  entryComponents: [IconToastComponent, UserDataChangeComponent, ConfirmationDialogComponent]
})
export class SharedModule {}
