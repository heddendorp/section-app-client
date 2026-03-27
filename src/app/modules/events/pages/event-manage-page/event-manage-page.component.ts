import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  AdmitUserGQL,
  CheckInUserGQL,
  CreateEventRegistrationCodeGQL,
  DeleteRegistrationCodeGQL,
  KickFromEventGQL,
  LoadEventForManagementGQL,
  LoadEventForManagementQuery,
  RegistrationStatus,
  TumiEvent,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable, share, Subject, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe, CurrencyPipe, DatePipe, DOCUMENT } from '@angular/common';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionListComponent } from '../../../shared/components/transaction-list/transaction-list.component';
import { MatIconModule } from '@angular/material/icon';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { MatTableModule } from '@angular/material/table';
import { EventManageFinancesComponent } from '../../components/management/event-manage-finances/event-manage-finances.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventParticipantsTableComponent } from '@tumi/legacy-app/modules/events/components/event-participants-table/event-participants-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';

type ManagedEvent = LoadEventForManagementQuery['event'];
type ManagedRegistration = ManagedEvent['participantRegistrations'][number];

@Component({
  selector: 'app-event-manage-page',
  templateUrl: './event-manage-page.component.html',
  styleUrls: ['./event-manage-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  imports: [
    MatToolbarModule,
    BackButtonComponent,
    MatButtonModule,
    RouterLink,
    MatProgressBarModule,
    MatExpansionModule,
    EventManageFinancesComponent,
    MatTableModule,
    UserChipComponent,
    MatIconModule,
    TransactionListComponent,
    MatMenuModule,
    MatListModule,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    ExtendDatePipe,
    EventParticipantsTableComponent,
  ],
})
export class EventManagePageComponent implements OnDestroy {
  public event$: Observable<LoadEventForManagementQuery['event']>;
  public environment = environment;
  public feeShare$: Observable<number>;
  public lastUserFeeShare$: Observable<number>;
  public registrationTableColumns$: Observable<string[]>;
  expandedRegistration?: TumiEvent;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  private kickFromEventGQL = inject(KickFromEventGQL);
  private snackBar = inject(MatSnackBar);

  constructor(
    private title: Title,
    private loadEvent: LoadEventForManagementGQL,
    private checkInMutation: CheckInUserGQL,
    private createEventRegistrationCodeGQL: CreateEventRegistrationCodeGQL,
    private route: ActivatedRoute,
    private deleteRegistrationCodeGQL: DeleteRegistrationCodeGQL,
    private admitUserGQL: AdmitUserGQL,
    @Inject(DOCUMENT) protected document: Document,
  ) {
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' }),
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event),
      tap((event) => this.title.setTitle(`Manage ${event.title}`)),
    );
    this.registrationTableColumns$ = this.event$.pipe(
      map((event) => {
        const baseColumns = ['name', 'registrationStatus', 'paid'];
        const guestsEnabled = event.multiGuestSettings?.enabled ?? false;
        const guestColumns = guestsEnabled ? ['guests'] : [];
        return [
          ...baseColumns,
          ...guestColumns,
          'registered',
          'checkIn',
          'expand',
        ];
      }),
    );
    this.feeShare$ = this.event$.pipe(
      map((event) =>
        Math.floor(
          (event.refundFeesPaid /
            event.participantRegistrations.filter(
              (r) => r.status !== RegistrationStatus.Cancelled,
            ).length) *
            100,
        ),
      ),
      share(),
    );
    this.lastUserFeeShare$ = this.event$.pipe(
      map(
        (event) =>
          event.refundFeesPaid -
          Math.floor(
            (event.refundFeesPaid /
              event.participantRegistrations.filter(
                (r) => r.status !== RegistrationStatus.Cancelled,
              ).length) *
              100,
          ) *
            (event.participantRegistrations.filter(
              (r) => r.status !== RegistrationStatus.Cancelled,
            ).length -
              1),
      ),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  private getCheckinFailureReason(error: unknown) {
    if (!error || typeof error !== 'object' || !('graphQLErrors' in error)) {
      return null;
    }

    const graphQLErrors = error.graphQLErrors;
    if (!Array.isArray(graphQLErrors)) {
      return null;
    }

    for (const graphQLError of graphQLErrors) {
      if (!graphQLError || typeof graphQLError !== 'object') {
        continue;
      }
      const extensions =
        'extensions' in graphQLError ? graphQLError.extensions : undefined;
      if (!extensions || typeof extensions !== 'object') {
        continue;
      }
      if (
        extensions['code'] === 'CHECKIN_UNAVAILABLE' &&
        typeof extensions['reason'] === 'string'
      ) {
        return extensions['reason'];
      }
    }

    return null;
  }

  private async refetchEvent() {
    try {
      const { data } = await this.loadEventQueryRef.refetch({
        id: this.route.snapshot.paramMap.get('eventId') ?? '',
      });
      return data.event;
    } catch {
      return null;
    }
  }

  async kickWithRefund(registrationId: string, refundFees = true) {
    const event = await firstValueFrom(this.event$);
    const proceed = confirm('Are you sure you want to remove this user?');
    if (event && proceed) {
      try {
        await firstValueFrom(
          this.kickFromEventGQL.mutate({
            withRefund: true,
            refundFees,
            registrationId,
          }),
        );
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    }
  }

  async kick(registrationId: string) {
    const event = await firstValueFrom(this.event$);
    const proceed = confirm(
      'Are you sure you want to remove this user without refund?',
    );
    if (event && proceed) {
      try {
        await firstValueFrom(
          this.kickFromEventGQL.mutate({
            withRefund: false,
            registrationId,
            refundFees: false,
          }),
        );
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    }
  }

  async checkin(id: string) {
    try {
      await firstValueFrom(this.checkInMutation.mutate({ id, manual: true }));
      await this.refetchEvent();
      this.snackBar.open('Participant checked in.');
    } catch (error) {
      const reason = this.getCheckinFailureReason(error);
      const event = await this.refetchEvent();
      const registration = event?.participantRegistrations.find(
        (participantRegistration) => participantRegistration.id === id,
      );

      if (reason === 'STATE_CHANGED' || reason === 'NO_ENTRIES_REMAINING') {
        this.snackBar.open(
          'Another organizer already checked this participant in. The event list has been refreshed.',
        );
      } else if (registration?.checkInTime) {
        this.snackBar.open(
          'The connection was unstable, but the participant is checked in.',
        );
      } else {
        this.snackBar.open(
          'Check-in failed and no change was saved. Please try again.',
        );
      }
    }
  }

  async createRegistrationCode() {
    const event = await firstValueFrom(this.event$);
    await firstValueFrom(
      this.createEventRegistrationCodeGQL.mutate({
        eventId: event.id,
        isPublic: false,
      }),
    );
    this.loadEventQueryRef.refetch();
  }

  isAwaitingAdmission(
    event: ManagedEvent,
    registration: ManagedRegistration,
  ): boolean {
    return (
      event.registrationMode === 'STRIPE' &&
      event.deferredPayment &&
      registration.transactions.length === 0
    );
  }

  getStatusOfRegistration(registration: any) {
    if (registration.status === RegistrationStatus.Successful)
      return 'successful';
    if (registration.cancellationReason) {
      if (registration.cancellationReason.includes('moved')) return 'moved';
      if (registration.cancellationReason.includes('given up'))
        return 'deregistered';
    }
    return registration.status.toLowerCase();
  }

  async deleteRegistrationCode(id: string) {
    confirm('Are you sure you want to delete this registration code?') &&
      (await firstValueFrom(this.deleteRegistrationCodeGQL.mutate({ id })));
    this.loadEventQueryRef.refetch();
  }

  getWAUrl(registration: any, event: any) {
    const url = `https://wa.me/${registration.user.phone.replace(
      '+',
      '',
    )}?text=${encodeURIComponent(
      `Hi ${registration.user.firstName},\nyou have registered for ${event.title}.\n\nPlease note that there was an issue with your payment and we had to restart it. You can pay at ${document.location.origin}/events/${event.id}. Your registration will be cancelled if the payment is not successful in the next 22 hrs.\nBest regards,\nTUMi`,
    )}`;
    return url;
  }

  async admitUser(id: string) {
    await firstValueFrom(this.admitUserGQL.mutate({ registrationId: id }));
  }

  // Guest analytics methods
  getTotalGuests(registrations: any[]): number {
    return registrations.reduce(
      (total, reg) => total + (reg.guestCount || 0),
      0,
    );
  }

  getTotalPartySize(registrations: any[]): number {
    return registrations.reduce(
      (total, reg) => total + (reg.totalPartySize || 1),
      0,
    );
  }

  getTotalGuestCheckIns(registrations: any[]): number {
    return registrations.reduce(
      (total, reg) => total + (reg.guestCheckIns || 0),
      0,
    );
  }

  getGuestRevenue(registrations: any[]): number {
    return registrations.reduce((total, reg) => {
      const guestCount = reg.guestCount || 0;
      const guestPrice = parseFloat(reg.guestUnitPrice || '0');
      return total + guestCount * guestPrice;
    }, 0);
  }
}
