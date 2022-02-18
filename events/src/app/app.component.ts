import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PermissionService } from './services/permission.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isMember$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  constructor(public auth: AuthService, public permissions: PermissionService) {
    this.isAdmin$ = this.permissions.hasRole('Admin');
    this.isMember$ = this.permissions.hasStatus('Full', 'Trial', 'Sponsor');
  }
}
