import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PermissionService } from './services/permission.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public auth: AuthService,
    public permissions: PermissionService
  ) {}
}
