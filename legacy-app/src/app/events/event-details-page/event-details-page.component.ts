import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';
import { AuthService } from '../../shared/services/auth.service';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss']
})
export class EventDetailsPageComponent implements OnInit, OnDestroy {
  event$: Observable<TumiEvent>;
  signed$: Observable<boolean>;
  destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private fireFunctions: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.event$ = this.route.data.pipe(map(data => data.event));
    const eventWithTutors = this.route.paramMap.pipe(
      switchMap(params => this.userService.getEventWithTutors(params.get('eventId')))
    );
    const eventWithSignups = this.route.paramMap.pipe(
      switchMap(params => this.eventService.getEventWithRegistrations(params.get('eventId')))
    );
    this.event$ = this.authService.isTutor.pipe(
      switchMap(isTutor => (isTutor ? eventWithTutors : eventWithSignups)),
      startWith(this.route.snapshot.data.event)
    );
    this.signed$ = this.event$.pipe(
      switchMap(event =>
        this.authService.user.pipe(
          map(
            user =>
              !!user &&
              (event.tutorSignups.includes(user.id) || event.userSignups.map(signup => signup.id).includes(user.id))
          )
        )
      )
    );
  }

  async registerTutor(eventId) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to sign up as a tutor for this event?`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      const snack = this.snackBar.openFromComponent(IconToastComponent, {
        data: { message: `Please wait while we're signing you up`, icon: 'wait' },
        duration: 0
      });
      await this.fireFunctions
        .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
          eventId,
          type: 'tutor'
        })
        .toPromise();
      snack.dismiss();
      await this.router.navigate(['events', 'my']);
    }
  }

  async registerStudent(eventId) {
    const snack = this.snackBar.openFromComponent(IconToastComponent, {
      data: { message: `Please wait while we're signing you up`, icon: 'wait' },
      duration: 0
    });
    await this.fireFunctions
      .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
        eventId,
        type: 'student'
      })
      .toPromise();
    snack.dismiss();
    await this.router.navigate(['events', 'my']);
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
