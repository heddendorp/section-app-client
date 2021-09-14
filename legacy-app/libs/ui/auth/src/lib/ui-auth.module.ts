import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [AuthButtonComponent],
  exports: [AuthButtonComponent],
})
export class UiAuthModule {}
