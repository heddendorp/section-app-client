import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import {
  CreateEventRegistrationCodeGQL,
  LoadEventQuery,
  LoadRegistrationForMoveGQL,
  LoadRegistrationForMoveQuery,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-move-event-dialog',
  templateUrl: './move-event-dialog.component.html',
  styleUrls: ['./move-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveEventDialogComponent {
  public registration$: Observable<
    LoadRegistrationForMoveQuery['registration']
  >;
  public buttonDisabled = new BehaviorSubject(false);
  private registrationQueryRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: LoadEventQuery['event'] },
    private registrationForMoveGQL: LoadRegistrationForMoveGQL,
    private createEventRegistrationCodeGQL: CreateEventRegistrationCodeGQL
  ) {
    this.registrationQueryRef = this.registrationForMoveGQL.watch();
    this.registration$ = this.registrationQueryRef.valueChanges.pipe(
      map(({ data }) => data.registration)
    );
    this.registrationQueryRef.refetch({
      registrationId: this.data.event?.activeRegistration?.id ?? '',
    });
  }

  async createOrder() {
    this.buttonDisabled.next(true);
    const registration = await firstValueFrom(this.registration$);
    if (registration) {
      await firstValueFrom(
        this.createEventRegistrationCodeGQL.mutate({
          registrationId: registration.id,
          eventId: registration.eventId,
        })
      );
      this.registrationQueryRef.refetch();
    }
    this.buttonDisabled.next(false);
  }
}
