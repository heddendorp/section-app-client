import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSortModule } from '@angular/material/sort';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IconToastComponent } from './components/icon-toast/icon-toast.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { UserDataChangeComponent } from './components/user-data-change/user-data-change.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FacultyPipe } from './services/faculty.pipe';
import { TypePipe } from './services/type.pipe';
import { DegreePipe } from './services/degree.pipe';

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
  MatSelectModule
];

@NgModule({
  imports: [CommonModule, materialModules, FlexLayoutModule, ReactiveFormsModule],
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
    IconToastComponent,
    UserDataChangeComponent,
    FacultyPipe,
    DegreePipe,
    TypePipe
  ],
  declarations: [IconToastComponent, UserDataChangeComponent, FacultyPipe, TypePipe, DegreePipe],
  entryComponents: [IconToastComponent, UserDataChangeComponent]
})
export class SharedModule {}
