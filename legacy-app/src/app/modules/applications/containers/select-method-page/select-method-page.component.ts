import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@tumi/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-method-page',
  templateUrl: './select-method-page.component.html',
  styleUrls: ['./select-method-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMethodPageComponent {
  isAuthenticated$: Observable<boolean> = this.authService.authenticated$;
  isTutor$: Observable<boolean> = this.authService.isTutor$;
  constructor(private authService: AuthService) {}
  startLogin(): void {
    this.authService.login();
  }
}
