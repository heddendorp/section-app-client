import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  DOCUMENT,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import {
  CreateEventRegistrationCodeGQL,
  LoadEventQuery,
  LoadRegistrationForMoveGQL,
  LoadRegistrationForMoveQuery,
} from '@tumi/legacy-app/generated/generated';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-move-event-dialog',
  templateUrl: './move-event-dialog.component.html',
  styleUrls: ['./move-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, AsyncPipe],
})
export class MoveEventDialogComponent {
  public registration$: Observable<
    LoadRegistrationForMoveQuery['registration']
  >;
  public buttonDisabled = new BehaviorSubject(false);
  private registrationQueryRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: LoadEventQuery['event'] },
    @Inject(DOCUMENT) protected document: Document,
    private registrationForMoveGQL: LoadRegistrationForMoveGQL,
    private createEventRegistrationCodeGQL: CreateEventRegistrationCodeGQL,
  ) {
    this.registrationQueryRef = this.registrationForMoveGQL.watch({
      variables: {
        registrationId: this.data.event?.activeRegistration?.id ?? '',
      },
    });
    this.registration$ = this.registrationQueryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.registration),
    );
    this.registrationQueryRef.refetch({
      registrationId: this.data.event?.activeRegistration?.id ?? '',
    });
  }

  async createCode(isPublic = false) {
    this.buttonDisabled.next(true);
    const registration = await firstValueFrom(this.registration$);
    if (registration) {
      await firstValueFrom(
        this.createEventRegistrationCodeGQL.mutate({
          variables: {
            registrationId: registration.id,
            eventId: registration.eventId,
            isPublic,
          },
        }),
      );
      this.registrationQueryRef.refetch();
    }
    this.buttonDisabled.next(false);
  }
}
