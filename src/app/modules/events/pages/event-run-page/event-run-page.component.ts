import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
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
import { IfRoleDirective } from '../../../shared/directives/if-role.directive';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventParticipantsTableComponent } from '@tumi/legacy-app/modules/events/components/event-participants-table/event-participants-table.component';

@Component({
  selector: 'app-event-run-page',
  templateUrl: './event-run-page.component.html',
  styleUrls: ['./event-run-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    BackButtonComponent,
    NgIf,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatListModule,
    NgFor,
    UserChipComponent,
    IfRoleDirective,
    EventSubmissionOverviewComponent,
    AsyncPipe,
    CurrencyPipe,
    EventParticipantsTableComponent,
  ],
})
export class EventRunPageComponent implements OnDestroy {
  public Role = Role;
  public event$: Observable<LoadEventForRunningQuery['event']>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();

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

  async checkin(id: string) {
    throw await this.checkInMutation.mutate({ id, manual: true }).toPromise();
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
        .join(';'),
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

  async copyParticipantMails() {
    const event = await firstValueFrom(this.event$);
    if (!event) return;
    const pending = this.clipboard.beginCopy(
      event.participantRegistrations
        .map(
          (registration) =>
            registration.user.communicationEmail || registration.user.email,
        )
        .join(';'),
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
        .join(';'),
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

  async generateMail() {
    const event = await firstValueFrom(this.event$);
    const a = window.document.createElement('a');
    const utf8_blob = new Blob([event.mailTemplate], { endings: 'native' });
    a.href = window.URL.createObjectURL(utf8_blob);
    a.download = `${event.title}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        .join(';'),
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
}
