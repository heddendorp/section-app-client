import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewUserPageComponent } from './pages/new-user-page/new-user-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilMaterialModule } from '@tumi/util/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'exact', component: ProfilePageComponent },
      { path: 'new', component: NewUserPageComponent },
    ]),
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    FlexLayoutModule,
    UtilMaterialModule,
  ],
  declarations: [NewUserPageComponent, ProfilePageComponent],
})
export class UiProfileModule {}
