import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewUserPageComponent } from './pages/new-user-page/new-user-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'new', pathMatch: 'exact', component: NewUserPageComponent },
    ]),
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatButtonModule,
  ],
  declarations: [NewUserPageComponent],
})
export class UiProfileModule {}
