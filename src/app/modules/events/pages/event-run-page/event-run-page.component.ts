import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  AddCostItemToEventGQL,
  CheckInUserGQL,
  LoadEventForRunningGQL,
  LoadEventForRunningQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom, map, Observable, Subject, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Clipboard } from '@angular/cdk/clipboard';
import { EventSubmissionOverviewComponent } from '../../components/event-submission-overview/event-submission-overview.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventParticipantsTableComponent } from '@tumi/legacy-app/modules/events/components/event-participants-table/event-participants-table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCostItemDialogComponent } from '@tumi/legacy-app/modules/events/components/add-cost-item-dialog/add-cost-item-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-run-page',
  templateUrl: './event-run-page.component.html',
  styleUrls: ['./event-run-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    BackButtonComponent,
    CurrencyPipe,
    EventParticipantsTableComponent,
    EventSubmissionOverviewComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatToolbarModule,
    RouterLink,
  ],
})
export class EventRunPageComponent implements OnDestroy {
  public Role = Role;
  public event$: Observable<LoadEventForRunningQuery['event']>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  private dialog = inject(MatDialog);
  private addCostItemToEventGQL = inject(AddCostItemToEventGQL);
  private snackBar = inject(MatSnackBar);

  constructor(
    private title: Title,
    private loadEvent: LoadEventForRunningGQL,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    private checkInMutation: CheckInUserGQL,
  ) {
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' }),
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event),
      tap((event) => this.title.setTitle(`Run ${event.title}`)),
    );
    this.loadEventQueryRef.startPolling(5000);
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

  async copyOrganizerMails() {
    const event = await firstValueFrom(this.event$);
    if (!event) return;
    const pending = this.clipboard.beginCopy(
      event.organizerRegistrations
        .map(
          (registration) =>
            registration.user.communicationEmail || registration.user.email,
        )
        .join('; '),
    );
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }
  getWhatsAppLink(phone = '') {
    return `https://wa.me/${phone.replaceAll(' ', '').replaceAll('+', '')}`;
  }

  getTelegramLink(username = '') {
    return `https://t.me/${username}`;
  }

  async copyParticipantMails() {
    const event = await firstValueFrom(this.event$);
    if (!event) return;
    const pending = this.clipboard.beginCopy(
      event.participantRegistrations
        .map(
          (registration) =>
            registration.user.communicationEmail || registration.user.email,
        )
        .join('; '),
    );
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

  async copyCheckedInMails() {
    const event = await firstValueFrom(this.event$);
    if (!event) return;
    const pending = this.clipboard.beginCopy(
      event.participantRegistrations
        .filter((registration) => registration.checkInTime)
        .map(
          (registration) =>
            registration.user.communicationEmail || registration.user.email,
        )
        .join('; '),
    );
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

  async copyNonCheckedMails() {
    const event = await firstValueFrom(this.event$);
    if (!event) return;
    const pending = this.clipboard.beginCopy(
      event.participantRegistrations
        .filter((registration) => !registration.checkInTime)
        .map(
          (registration) =>
            registration.user.communicationEmail || registration.user.email,
        )
        .join('; '),
    );
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

  async addCostItem() {
    const item = await firstValueFrom(
      this.dialog.open(AddCostItemDialogComponent).afterClosed(),
    );
    if (item) {
      await firstValueFrom(
        this.addCostItemToEventGQL.mutate({
          input: item,
          eventId: this.route.snapshot.paramMap.get('eventId') ?? '',
        }),
      );
    }
  }

  getRemainingParticipantSpots(event: LoadEventForRunningQuery['event']) {
    return Math.max(0, event.participantLimit - event.totalRegisteredCount);
  }

  getTotalGuests(registrations: any[]): number {
    return registrations.reduce(
      (total, reg) => total + (reg.guestCount || 0),
      0,
    );
  }

  getTotalGuestCheckIns(registrations: any[]): number {
    return registrations.reduce(
      (total, reg) => total + (reg.guestCheckIns || 0),
      0,
    );
  }
}
