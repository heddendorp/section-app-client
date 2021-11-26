import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  CheckInUserGQL,
  CreateEventRegistrationCodeGQL,
  DeregisterFromEventGQL,
  LoadEventForManagementGQL,
  LoadEventForManagementQuery,
  RegistrationStatus,
} from '@tumi/data-access';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';

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
  public environment = environment;
  constructor(
    private title: Title,
    private loadEvent: LoadEventForManagementGQL,
    private deregisterFromEventGQL: DeregisterFromEventGQL,
    private checkInMutation: CheckInUserGQL,
    private createEventRegistrationCodeGQL: CreateEventRegistrationCodeGQL,
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
    // this.loadEventQueryRef.startPolling(5000);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async kickWithRefund(registrationId: string, covid = false) {
    const event = await firstValueFrom(this.event$);
    const proceed = confirm('Are you sure you want to remove this user?');
    if (event && proceed) {
      try {
        await firstValueFrom(
          this.deregisterFromEventGQL.mutate({
            withRefund: true,
            registrationId,
          })
        );
        //     await this.removeUserWithRefund
        //       .mutate({ eventId: event.id, userId })
        //       .toPromise();
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
      'Are you sure you want to remove this user without refund?'
    );
    if (event && proceed) {
      try {
        await firstValueFrom(
          this.deregisterFromEventGQL.mutate({
            withRefund: false,
            registrationId,
          })
        );
        //     await this.removeUser.mutate({ registrationId }).toPromise();
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    }
  }

  async checkin(id: string) {
    throw await this.checkInMutation.mutate({ id, manual: true }).toPromise();
  }

  getTable(
    participantRegistrations: LoadEventForManagementQuery['event']['participantRegistrations']
  ) {
    return participantRegistrations
      .filter((r) => !r.checkInTime && r.submissions.length)
      .filter((r) => r.status !== RegistrationStatus.Cancelled)
      .map((r) => ({
        ...r,
        address: r.submissions
          .find((s) => s.submissionItem.name === 'Address')
          ?.data?.value?.split('\n'),
      }));
  }

  filterRegistrations(
    participantRegistrations: LoadEventForManagementQuery['event']['participantRegistrations']
  ) {
    return participantRegistrations.filter(
      (r) => r.status !== RegistrationStatus.Cancelled
    );
  }

  joinOrganizers(
    organizerRegistrations: LoadEventForManagementQuery['event']['organizerRegistrations']
  ) {
    return organizerRegistrations.map((r) => r.user.fullName).join(', ');
  }

  async createRegistrationCode(sepaAllowed = false) {
    const event = await firstValueFrom(this.event$);
    await firstValueFrom(
      this.createEventRegistrationCodeGQL.mutate({
        eventId: event.id,
        isPublic: false,
        sepaAllowed,
      })
    );
    this.loadEventQueryRef.refetch();
  }
}
