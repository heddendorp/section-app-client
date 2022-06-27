import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  CheckInUserGQL,
  LoadEventForRunningGQL,
  LoadEventForRunningQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, Observable, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-event-run-page',
  templateUrl: './event-run-page.component.html',
  styleUrls: ['./event-run-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private checkInMutation: CheckInUserGQL
  ) {
    this.title.setTitle('TUMi - run event');
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' })
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event)
    );
    this.loadEventQueryRef.startPolling(5000);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async copyOrganizerMails() {
    const event = await firstValueFrom(this.event$);
    if (!event) return;
    const pending = this.clipboard.beginCopy(
      event.organizerRegistrations
        .map((registration) => registration.user.email)
        .join(';')
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
        .map((registration) => registration.user.email)
        .join(';')
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
        .map((registration) => registration.user.email)
        .join(';')
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

  async checkin(id: string) {
    throw await this.checkInMutation.mutate({ id, manual: true }).toPromise();
  }
}
