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
import { MatListModule } from '@angular/material/list';
import { UtilPipesModule } from '@tumi/util/pipes';
import { UpdateProfileDialogComponent } from './components/update-profile-dialog/update-profile-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClaimEventDialogComponent } from './components/claim-event-dialog/claim-event-dialog.component';

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
    UtilPipesModule,
    MatListModule,
    MatDialogModule,
  ],
  declarations: [
    NewUserPageComponent,
    ProfilePageComponent,
    UpdateProfileDialogComponent,
    ClaimEventDialogComponent,
  ],
})
export class UiProfileModule {}
