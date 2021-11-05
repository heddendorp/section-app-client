import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import {
  LoadEventForRunningGQL,
  LoadEventForRunningQuery,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ScanningDialogComponent } from '../../components/running/scanning-dialog/scanning-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'tumi-event-run-page',
  templateUrl: './event-run-page.component.html',
  styleUrls: ['./event-run-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRunPageComponent implements OnDestroy {
  public event$: Observable<LoadEventForRunningQuery['event']>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  constructor(
    private title: Title,
    private loadEvent: LoadEventForRunningGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private clipboard: Clipboard
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

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async scanCode() {
    const event = await firstValueFrom(this.event$);
    if (event) {
      this.dialog.open(ScanningDialogComponent, {
        minWidth: '95vw',
        minHeight: '95vh',
        data: { id: event.id },
      });
    }
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
}
