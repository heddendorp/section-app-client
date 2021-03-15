import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconToastComponent } from '@tumi/modules/shared';
import { AuthService } from '@tumi/services';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-online-registration',
  templateUrl: './online-registration.component.html',
  styleUrls: ['./online-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineRegistrationComponent implements OnChanges {
  @Input() event: any;
  public signupSuject = new Subject<Observable<any>>();
  public canSignUp$: Observable<any>;

  constructor(
    private fireFunctions: AngularFireFunctions,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.canSignUp$ = this.signupSuject.pipe(switchMap((obs) => obs));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.event) {
      this.signupSuject.next(
        this.auth.user$.pipe(
          switchMap((user) =>
            this.event.registrations.pipe(
              map(
                (registrations: { id: string }[]) =>
                  !registrations.find(
                    (registration) => registration.id === user.id
                  )
              )
            )
          )
        )
      );
    }
  }

  async register(): Promise<void> {
    const snack = this.snackBar.openFromComponent(IconToastComponent, {
      data: {
        message: `Please wait while we're signing you up`,
        icon: 'icon-loading',
      },
      duration: 0,
    });
    await this.fireFunctions
      .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>(
        'registerForEvent'
      )({
        eventId: this.event.id,
        type: 'student',
      })
      .toPromise();
    snack.dismiss();
  }
}
