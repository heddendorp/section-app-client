import {
  Component,
  inject,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
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
  DeRegisterOrganizerFromEventGQL,
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
import { MarkdownComponent } from 'ngx-markdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventHeaderComponent } from '../../components/event-header/event-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { DateTime } from 'luxon';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    EventHeaderComponent,
    MatExpansionModule,
    MarkdownComponent,
    UserChipComponent,
    MatDividerModule,
    RatingItemComponent,
    RateEventComponent,
    CheckRegistrationTimeComponent,
    ExternalEventRegistrationComponent,
    StripeEventRegistrationComponent,
    OnlineEventRegistrationComponent,
    MatListModule,
    AsyncPipe,
    ExtendDatePipe,
    IconURLPipe,
    NgOptimizedImage,
    CurrencyPipe,
  ],
})
export class EventDetailsPageComponent implements OnDestroy {
  public event$: Observable<LoadEventQuery['event']>;
  public user$: Observable<LoadUserForEventQuery['currentUser']>;
  public bestPrice$: Observable<Price>;
  public eventOver$: Observable<boolean>;
  public eventStarted$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  public RegistrationMode = RegistrationMode;
  public ratingExpanded$ = new BehaviorSubject(false);
  public lastOrganizerDeRegistration$: Observable<Date>;
  public organizerCanDeRegister$: Observable<{
    result: boolean;
    reason: string;
  }>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  private deRegisterOrganizerFromEventGQL = inject(
    DeRegisterOrganizerFromEventGQL,
  );

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
    this.loadEventQueryRef = this.loadEvent.watch({
      variables: {
        id: this.route.snapshot.paramMap.get('eventId') ?? '',
      },
    });
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' }),
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.event),
      shareReplay(1),
      tap((event) => {
        if (!event.activeRegistration?.rating) {
          this.ratingExpanded$.next(true);
        }
      }),
    );
    this.lastOrganizerDeRegistration$ = this.event$.pipe(
      map((event) => {
        const settings = event.deRegistrationSettings.organizers;
        return DateTime.fromISO(event.start)
          .minus({
            days: settings.minimumDaysForDeRegistration,
          })
          .toJSDate();
      }),
    );
    this.organizerCanDeRegister$ = this.event$.pipe(
      map((event) => {
        const settings = event.deRegistrationSettings.organizers;
        if (!settings.deRegistrationPossible) {
          return {
            result: false,
            reason:
              'De-registration is not possible for organizers on this event.',
          };
        }
        if (
          DateTime.fromISO(event.start)
            .minus({
              days: settings.minimumDaysForDeRegistration,
            })
            .toJSDate() < new Date()
        ) {
          return {
            result: false,
            reason: `De-registration is only possible up to ${settings.minimumDaysForDeRegistration} days before the event.`,
          };
        }
        return { result: true, reason: '' };
      }),
    );
    firstValueFrom(this.event$).then((event) => {
      this.title.setTitle(`${event.title}`);
    });
    this.bestPrice$ = this.event$.pipe(
      switchMap((event) =>
        this.permissions.getPricesForUser(
          event.prices?.options,
          new Date(event.start),
        ),
      ),
      filter((prices) => prices.length > 0),
      map((prices) => prices.reduce((a, b) => (a.amount < b.amount ? a : b))),
    );
    this.user$ = this.loadUserForEventGQL.watch().valueChanges.pipe(
      onlyCompleteData(),
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

  getWhatsAppLink(phone = '') {
    return `https://wa.me/${phone.replaceAll(' ', '').replaceAll('+', '')}`;
  }

  getTelegramLink(username = '') {
    return `https://t.me/${username}`;
  }

  async registerAsOrganizer() {
    const event = await this.event$.pipe(first()).toPromise();
    if (event) {
      this.snackbar.open('Signing you up ⏳', undefined, { duration: 0 });
      try {
        await firstValueFrom(
          this.registerForEvent.mutate({
            variables: {
              eventId: event.id,
              type: RegistrationType.Organizer,
            },
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
    if (event?.activeRegistration) {
      this.dialog.open(QrDisplayDialogComponent, {
        data: {
          id: event.activeRegistration.id,
          event: event.title,
          user: event.activeRegistration.user.fullName,
          didAttend: event.activeRegistration.didAttend ?? false,
          guestCount: event.activeRegistration.guestCount ?? 0,
          totalPartySize: event.activeRegistration.totalPartySize ?? 0,
          remainingEntries: event.activeRegistration.remainingEntries ?? 0,
        },
      });
    }
  }

  async saveRating(
    $event: { rating: number; comment: string; anonymousRating: boolean },
    id: string,
  ) {
    await firstValueFrom(
      this.submitEventFeedbackGQL.mutate({
        variables: {
          id,
          anonymousRating: $event.anonymousRating,
          rating: $event.rating,
          comment: $event.comment,
        },
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

  async cancelOrganizerRegistration() {
    const event = await firstValueFrom(this.event$);
    if (!event.activeRegistration) {
      return;
    }
    await firstValueFrom(
      this.deRegisterOrganizerFromEventGQL.mutate({
        variables: {
          registrationId: event.activeRegistration.id,
        },
      }),
    );
  }

  public coerceNumber(value: unknown): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
