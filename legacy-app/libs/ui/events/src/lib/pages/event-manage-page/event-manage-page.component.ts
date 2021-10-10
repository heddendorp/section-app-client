import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  DeregisterFromEventGQL,
  DeregisterWithRefundGQL,
  LoadEventForManagementGQL,
  LoadEventForManagementQuery,
} from '@tumi/data-access';
import { Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-event-manage-page',
  templateUrl: './event-manage-page.component.html',
  styleUrls: ['./event-manage-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagePageComponent implements OnDestroy {
  public event$: Observable<LoadEventForManagementQuery['event']>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  constructor(
    private title: Title,
    private loadEvent: LoadEventForManagementGQL,
    private removeUserWithRefund: DeregisterWithRefundGQL,
    private removeUser: DeregisterFromEventGQL,
    private route: ActivatedRoute
  ) {
    this.title.setTitle('TUMi - manage event');
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

  async kickWithRefund(userId: string) {
    const event = await this.event$.pipe(first()).toPromise();
    const proceed = confirm('Are you sure you want to remove this user?');
    if (event && proceed) {
      try {
        await this.removeUserWithRefund
          .mutate({ eventId: event.id, userId })
          .toPromise();
      } catch (e) {
        alert(e.message);
      }
    }
  }

  async kick(userId: string) {
    const event = await this.event$.pipe(first()).toPromise();
    const proceed = confirm('Are you sure you want to remove this user?');
    if (event && proceed) {
      try {
        await this.removeUser.mutate({ eventId: event.id, userId }).toPromise();
      } catch (e) {
        alert(e.message);
      }
    }
  }
}
