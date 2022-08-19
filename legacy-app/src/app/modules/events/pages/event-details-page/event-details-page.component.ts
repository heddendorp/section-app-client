import { Component, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  first,
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Title } from '@angular/platform-browser';
import { QrDisplayDialogComponent } from '@tumi/legacy-app/modules/events/components/qr-display-dialog/qr-display-dialog.component';
import {
  GetCurrentUserGQL,
  LoadEventGQL,
  LoadEventQuery,
  RegisterForEventGQL,
  RegistrationMode,
  RegistrationType,
  SubmitEventFeedbackGQL,
} from '@tumi/legacy-app/generated/generated';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Price } from '../../../../../../../shared/data-types';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TraceClassDecorator } from '@sentry/angular';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
})
@TraceClassDecorator()
export class EventDetailsPageComponent implements OnDestroy {
  public event$: Observable<LoadEventQuery['event']>;
  public user$: Observable<LoadEventQuery['currentUser']>;
  public bestPrice$: Observable<Price>;
  public eventOver$: Observable<boolean>;
  public eventStarted$: Observable<boolean>;
  public hasAccount$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  public RegistrationMode = RegistrationMode;
  private loadEventQueryRef;
  private destroyed$ = new Subject();

  public ratingExpanded$ = new BehaviorSubject(false);

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private loadEvent: LoadEventGQL,
    private loadCurrentUser: GetCurrentUserGQL,
    private registerForEvent: RegisterForEventGQL,
    private submitEventFeedbackGQL: SubmitEventFeedbackGQL,
    private dialog: MatDialog,
    public permissions: PermissionsService,
    private snackbar: MatSnackBar
  ) {
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' })
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event),
      shareReplay(1),
      tap((event) => {
        if (!event.activeRegistration?.rating) {
          this.ratingExpanded$.next(true);
        }
      })
    );
    firstValueFrom(this.event$).then((event) => {
      this.title.setTitle(`${event.title} - TUMi`);
    });
    this.bestPrice$ = this.event$.pipe(
      switchMap((event) =>
        this.permissions.getPricesForUser(event.prices?.options)
      ),
      filter((prices) => prices.length > 0),
      map((prices) => prices.reduce((a, b) => (a.amount < b.amount ? a : b)))
    );
    this.user$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser),
      shareReplay(1)
    );
    this.eventOver$ = this.event$.pipe(
      map((event) => (event?.end ? new Date(event.end) < new Date() : false))
    );
    this.eventStarted$ = this.event$.pipe(
      map((event) =>
        event?.start ? new Date(event.start) < new Date() : false
      )
    );
    this.loadEventQueryRef.startPolling(30000);
    this.hasAccount$ = this.loadCurrentUser.watch().valueChanges.pipe(
      map(({ data }) => !!data.currentUser),
      shareReplay(1)
    );
    this.isAdmin$ = permissions.isAdmin();

    if (router.url.includes('checkin')) {
      this.showCode();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async registerAsOrganizer() {
    const event = await this.event$.pipe(first()).toPromise();
    if (event) {
      this.snackbar.open('Signing you up ⏳', undefined, { duration: 0 });
      try {
        await firstValueFrom(
          this.registerForEvent.mutate({
            eventId: event.id,
            type: RegistrationType.Organizer,
          })
        );
        this.snackbar.open('Registration successful ✔️');
      } catch (e) {
        this.snackbar.open('⚠️ ' + e);
      }
    }
  }

  async showCode() {
    const event = await firstValueFrom(this.event$);
    if (event?.activeRegistration && !event.activeRegistration?.didAttend) {
      this.dialog.open(QrDisplayDialogComponent, {
        data: {
          id: event.activeRegistration.id,
          event: event.title,
          user: event.activeRegistration.user.fullName,
        },
        panelClass: 'modern',
      });
    }
  }

  async saveRating(
    $event: { rating: number; comment: string; anonymousRating: boolean },
    id: string
  ) {
    await firstValueFrom(
      this.submitEventFeedbackGQL.mutate({
        id,
        anonymousRating: $event.anonymousRating,
        rating: $event.rating,
        comment: $event.comment,
      })
    );
    this.loadEventQueryRef.refetch();

    this.ratingExpanded$.next(false);
  }

  expandRatingPanel() {
    this.ratingExpanded$.next(!this.ratingExpanded$.value);
    setTimeout(() => {
      if (this.ratingExpanded$.value) {
        document
          .querySelector('#rater')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}
