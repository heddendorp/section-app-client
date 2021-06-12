import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@tumi/services';

@Component({
  selector: 'app-anonymous-registration',
  templateUrl: './anonymous-registration.component.html',
  styleUrls: ['./anonymous-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnonymousRegistrationComponent {
  constructor(private auth: AuthService) {}

  login(): void {
    this.auth.login();
  }
}
