import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GetEventTemplateQuery,
  GetOrganizerOptionsQuery,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateTime } from 'luxon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventDialogComponent implements OnInit, OnDestroy {
  public eventDataForm: UntypedFormGroup;
  public RegistrationMode = RegistrationMode;
  private destroyed$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      template: GetEventTemplateQuery['eventTemplate'];
      organizers: GetOrganizerOptionsQuery['eventOrganizers'];
    },
    private fb: UntypedFormBuilder,
    private dialog: MatDialogRef<CreateEventDialogComponent>
  ) {
    this.eventDataForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      price: ['', Validators.required],
      registrationLink: ['', Validators.required],
      registrationMode: ['', Validators.required],
      participantLimit: ['', Validators.required],
      organizerLimit: ['', Validators.required],
      eventOrganizerId: ['', Validators.required],
      excludeFromRatings: [false, Validators.required],
      excludeFromStatistics: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.eventDataForm
      .get('start')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((startValue) =>
        this.eventDataForm.get('end')?.patchValue(
          DateTime.fromISO(startValue)
            .plus({
              hours: this.data.template?.duration,
            })
            .toISO({ includeOffset: false })
        )
      );
    this.eventDataForm
      .get('registrationMode')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        switch (mode) {
          case RegistrationMode.Stripe: {
            this.eventDataForm.get('price')?.enable();
            this.eventDataForm.get('registrationLink')?.disable();
            break;
          }
          case RegistrationMode.Online: {
            this.eventDataForm.get('price')?.disable();
            this.eventDataForm.get('registrationLink')?.disable();
            break;
          }
          case RegistrationMode.External: {
            this.eventDataForm.get('price')?.disable();
            this.eventDataForm.get('registrationLink')?.enable();
            break;
          }
        }
      });
  }

  onSubmit(): void {
    if (this.eventDataForm.valid) {
      const data = this.eventDataForm.value;
      this.dialog.close({
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }
}
