import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemberStatus } from '@tumi/models';
import { IconToastComponent } from '@tumi/modules/shared';
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
  isTrailMember$: Observable<boolean> = this.authService.hasMemberStatus$(
    MemberStatus.trial
  );
  isTutor$: Observable<boolean> = this.authService.isTutor$;
  isMember$: Observable<boolean> = this.authService.isMember$;
  constructor(
    private authService: AuthService,
    private snack: MatSnackBar,
    private functions: AngularFireFunctions
  ) {}

  startLogin(): void {
    this.authService.login();
  }

  async selfPromote() {
    this.snack.openFromComponent(IconToastComponent, {
      data: { icon: 'icon-loading', message: 'Processing promotion' },
      duration: 0,
    });
    await this.functions.httpsCallable('selfPromotion')({}).toPromise();
    this.snack.openFromComponent(IconToastComponent, {
      data: {
        icon: 'icon-checkmark',
        message: 'Your promotion was successfully processed!',
      },
    });
  }
}
