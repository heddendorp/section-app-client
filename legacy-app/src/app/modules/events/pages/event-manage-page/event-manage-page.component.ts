import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  CheckInUserGQL,
  CreateEventRegistrationCodeGQL,
  DeregisterFromEventGQL,
  LoadEventForManagementGQL,
  LoadEventForManagementQuery,
  RegistrationStatus,
  TumiEvent,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable, share, Subject, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-event-manage-page',
  templateUrl: './event-manage-page.component.html',
  styleUrls: ['./event-manage-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,  
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])]
})
export class EventManagePageComponent implements OnDestroy {
  public event$: Observable<LoadEventForManagementQuery['event']>;
  public environment = environment;
  public feeShare$: Observable<number>;
  public lastUserFeeShare$: Observable<number>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();

  registrationTableColumns: string[] = ['name', 'registrationStatus', 'paid', 'registered', 'checkIn', 'remove', 'expand'];
  expandedRegistration?: TumiEvent;

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
    this.feeShare$ = this.event$.pipe(
      map(
        (event) =>
          Math.floor(
            (event.refundFeesPaid /
              event.participantRegistrations.filter(
                (r) => r.status !== RegistrationStatus.Cancelled
              ).length) *
              100
          ) / 100
      ),
      share()
    );
    this.lastUserFeeShare$ = this.event$.pipe(
      map(
        (event) =>
          event.refundFeesPaid -
          (Math.floor(
            (event.refundFeesPaid /
              event.participantRegistrations.filter(
                (r) => r.status !== RegistrationStatus.Cancelled
              ).length) *
              100
          ) /
            100) *
            (event.participantRegistrations.filter(
              (r) => r.status !== RegistrationStatus.Cancelled
            ).length -
              1)
      )
    );
  }

  ngOnDestroy(): void {
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
