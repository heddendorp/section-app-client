import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  GetCurrentUserGQL,
  LoadEventGQL,
  LoadEventQuery,
  RegisterForEventGQL,
  RegistrationMode,
  RegistrationType,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { first, map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { QrDisplayDialogComponent } from '../../components/qr-display-dialog/qr-display-dialog.component';

@Component({
  selector: 'tumi-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnDestroy {
  public event$: Observable<LoadEventQuery['event']>;
  public user$: Observable<LoadEventQuery['currentUser']>;
  public hasAccount$: Observable<boolean>;
  public RegistrationMode = RegistrationMode;
  private loadEventQueryRef;
  private destroyed$ = new Subject();

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private loadEvent: LoadEventGQL,
    private loadCurrentUser: GetCurrentUserGQL,
    private registerForEvent: RegisterForEventGQL,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {
    this.title.setTitle('TUMi - event');
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' })
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event),
      shareReplay(1)
    );
    this.user$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser),
      shareReplay(1)
    );
    this.loadEventQueryRef.startPolling(5000);
    this.hasAccount$ = this.loadCurrentUser.watch().valueChanges.pipe(
      map(({ data }) => !!data.currentUser),
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async registerAsOrganizer() {
    const event = await this.event$.pipe(first()).toPromise();
    if (event) {
      this.snackbar.open('Signing you up ⏳', undefined, { duration: 0 });
      try {
        await this.registerForEvent
          .mutate({
            eventId: event.id,
            type: RegistrationType.Organizer,
          })
          .toPromise();
        this.snackbar.open('Registration successful ✔️');
      } catch (e) {
        this.snackbar.open('⚠️ ' + e);
      }
    }
  }

  async showCode() {
    const event = await this.event$.pipe(first()).toPromise();
    if (event?.registration) {
      this.dialog.open(QrDisplayDialogComponent, {
        data: {
          id: event.registration.id,
          event: event.title,
          user: event.registration.user.fullName,
        },
      });
    }
  }
}
