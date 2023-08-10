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
  LoadEventGQL,
  LoadEventQuery,
  LoadUserForEventGQL,
  LoadUserForEventQuery,
  RegisterForEventGQL,
  RegistrationMode,
  RegistrationType,
  SubmitEventFeedbackGQL,
} from '@tumi/legacy-app/generated/generated';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Price } from '@tumi/legacy-app/utils';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TraceClassDecorator } from '@sentry/angular-ivy';
import { AuthService } from '@auth0/auth0-angular';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatListModule } from '@angular/material/list';
import { OnlineEventRegistrationComponent } from '../../components/registration/online-event-registration/online-event-registration.component';
import { StripeEventRegistrationComponent } from '../../components/registration/stripe-event-registration/stripe-event-registration.component';
import { ExternalEventRegistrationComponent } from '../../components/registration/external-event-registration/external-event-registration.component';
import { CheckRegistrationTimeComponent } from '../../components/registration/check-registration-time/check-registration-time.component';
import { RateEventComponent } from '../../../shared/components/rate-event/rate-event.component';
import { RatingItemComponent } from '../../../shared/components/rating-item/rating-item.component';
import { MatDividerModule } from '@angular/material/divider';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventHeaderComponent } from '../../components/event-header/event-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  NgIf,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  AsyncPipe,
  DatePipe,
  NgOptimizedImage,
} from '@angular/common';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    EventHeaderComponent,
    MatExpansionModule,
    MarkdownModule,
    UserChipComponent,
    MatDividerModule,
    NgFor,
    RatingItemComponent,
    RateEventComponent,
    CheckRegistrationTimeComponent,
    NgSwitch,
    NgSwitchCase,
    ExternalEventRegistrationComponent,
    StripeEventRegistrationComponent,
    OnlineEventRegistrationComponent,
    MatListModule,
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
@TraceClassDecorator()
export class EventDetailsPageComponent implements OnDestroy {
  public event$: Observable<LoadEventQuery['event']>;
  protected deregistrationOptions$: Observable<
    LoadEventQuery['currentTenant']['settings']['deregistrationOptions']
  >;
  public user$: Observable<LoadUserForEventQuery['currentUser']>;
  public bestPrice$: Observable<Price>;
  public eventOver$: Observable<boolean>;
  public eventStarted$: Observable<boolean>;
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
    private loadUserForEventGQL: LoadUserForEventGQL,
    private registerForEvent: RegisterForEventGQL,
    private submitEventFeedbackGQL: SubmitEventFeedbackGQL,
    private dialog: MatDialog,
    public permissions: PermissionsService,
    private snackbar: MatSnackBar,
  ) {
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' }),
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event),
      shareReplay(1),
      tap((event) => {
        if (!event.activeRegistration?.rating) {
          this.ratingExpanded$.next(true);
        }
      }),
    );
    this.deregistrationOptions$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant.settings.deregistrationOptions),
    );
    firstValueFrom(this.event$).then((event) => {
      this.title.setTitle(`${event.title}`);
    });
    this.bestPrice$ = this.event$.pipe(
      switchMap((event) =>
        this.permissions.getPricesForUser(event.prices?.options),
      ),
      filter((prices) => prices.length > 0),
      map((prices) => prices.reduce((a, b) => (a.amount < b.amount ? a : b))),
    );
    this.user$ = this.loadUserForEventGQL.watch().valueChanges.pipe(
      map(({ data }) => data.currentUser),
      shareReplay(1),
    );
    this.eventOver$ = this.event$.pipe(
      map((event) => (event?.end ? new Date(event.end) < new Date() : false)),
    );
    this.eventStarted$ = this.event$.pipe(
      map((event) =>
        event?.start ? new Date(event.start) < new Date() : false,
      ),
    );
    this.loadEventQueryRef.startPolling(30000);
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
          }),
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
    id: string,
  ) {
    await firstValueFrom(
      this.submitEventFeedbackGQL.mutate({
        id,
        anonymousRating: $event.anonymousRating,
        rating: $event.rating,
        comment: $event.comment,
      }),
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
