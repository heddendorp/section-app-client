import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthButtonComponent } from './auth-button/auth-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AuthButtonComponent
  ],
  exports: [AuthButtonComponent]
})
export class AuthModule {}
