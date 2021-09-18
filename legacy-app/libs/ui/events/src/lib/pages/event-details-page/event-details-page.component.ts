import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LoadEventGQL,
  LoadEventQuery,
  RegisterForEventGQL,
  RegistrationMode,
  RegistrationType,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { first, map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnInit {
  public event$: Observable<LoadEventQuery['event']>;
  public RegistrationMode = RegistrationMode;

  constructor(
    private route: ActivatedRoute,
    private loadEvent: LoadEventGQL,
    private registerForEvent: RegisterForEventGQL,
    private snackbar: MatSnackBar
  ) {
    this.event$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.loadEvent.watch({ id: params.get('eventId') ?? '' }).valueChanges
      ),
      map(({ data }) => data.event)
    );
  }

  ngOnInit(): void {}

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
