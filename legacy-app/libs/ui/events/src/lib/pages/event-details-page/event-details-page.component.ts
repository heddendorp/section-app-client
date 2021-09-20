import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  LoadEventGQL,
  LoadEventQuery,
  RegisterForEventGQL,
  RegistrationMode,
  RegistrationType,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnInit, OnDestroy {
  public event$: Observable<LoadEventQuery['event']>;
  public RegistrationMode = RegistrationMode;
  private loadEventQueryRef;
  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private loadEvent: LoadEventGQL,
    private registerForEvent: RegisterForEventGQL,
    private snackbar: MatSnackBar
  ) {
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' })
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event)
    );
    this.loadEventQueryRef.startPolling(5000);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async registerAsOrganizer() {
    const event = await this.event$.pipe(first()).toPromise();
    if (event) {
      this.snackbar.open('Signing you up ⏳', undefined, { duration: 0 });
      await this.registerForEvent
        .mutate({
          eventId: event.id,
          type: RegistrationType.Organizer,
        })
        .toPromise();
      this.snackbar.open('Registration successful ✔️');
    }
  }
}
