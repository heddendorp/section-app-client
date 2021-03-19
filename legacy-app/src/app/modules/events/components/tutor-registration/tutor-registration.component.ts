import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  IconToastComponent,
} from '@tumi/modules/shared';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { AuthService } from '@tumi/services';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tutor-registration',
  templateUrl: './tutor-registration.component.html',
  styleUrls: ['./tutor-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorRegistrationComponent implements OnChanges {
  @Input() event: any;
  public canSignUp$: Observable<any>;

  constructor(
    private fireFunctions: AngularFireFunctions,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.canSignUp$ = of(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.event) {
      this.canSignUp$ = this.auth.user$.pipe(
        switchMap((user) => {
          const isOldTutor = user.isOldie;
          if (this.event.tutorSignups.includes(user.id)) {
            return of(false);
          }

          if (this.event.tutorSignups.length >= this.event.tutorSpots) {
            return of(false);
          }
          return this.event.registeredTutors.pipe(
            map((tutors: any[]) => {
              const oldieNum = tutors.filter((tutor: any) => tutor.isOldie)
                .length;
              const newbieNum = tutors.filter((tutor: any) => !tutor.isOldie)
                .length;
              if (this.event.splitTutorPlaces) {
                return isOldTutor
                  ? oldieNum < this.event.tutorSpots / 2
                  : newbieNum < this.event.tutorSpots / 2;
              }
              return tutors.length < this.event.tutorSpots;
            })
          );
        })
      );
    }
  }

  async register(): Promise<void> {
    const proceed = await this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: `Do you really want to sign up as a tutor for this event?`,
          result: true,
        },
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      this.snackBar.openFromComponent(IconToastComponent, {
        data: {
          message: `Please wait while we're signing you up`,
          icon: 'icon-loading',
        },
        duration: 0,
      });
      try {
        await this.fireFunctions
          .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>(
            'registerForEvent'
          )({
            eventId: this.event.id,
            type: 'tutor',
          })
          .toPromise();
        this.snackBar.openFromComponent(IconToastComponent, {
          data: {
            message: `Signup successful!`,
            icon: 'icon-checkmark',
          },
        });
      } catch (e) {
        console.log(e);
        this.snackBar.openFromComponent(IconToastComponent, {
          data: {
            message: `Something went wrong`,
            icon: 'icon-delete-sign',
          },
        });
      }
    }
  }
}
