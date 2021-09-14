import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { MatButtonModule } from '@angular/material/button';
import { IfStatusDirective } from './directives/if-status.directive';
import { IfRoleDirective } from './directives/if-role.directive';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [AuthButtonComponent, IfStatusDirective, IfRoleDirective],
  exports: [AuthButtonComponent, IfStatusDirective, IfRoleDirective],
})
export class UiAuthModule {}
