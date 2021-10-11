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
} from '@tumi/data-access';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
  selector: 'tumi-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventDialogComponent implements OnInit, OnDestroy {
  public eventDataForm: FormGroup;
  private destroyed$ = new Subject();
  public RegistrationMode = RegistrationMode;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      template: GetEventTemplateQuery['eventTemplate'];
      organizers: GetOrganizerOptionsQuery['organizers'];
    },
    private fb: FormBuilder,
    private dialog: MatDialogRef<CreateEventDialogComponent>
  ) {
    this.eventDataForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      price: ['', Validators.required],
      discountedPrice: ['', Validators.required],
      esnDiscount: ['', Validators.required],
      registrationLink: ['', Validators.required],
      registrationMode: ['', Validators.required],
      participantLimit: ['', Validators.required],
      organizerLimit: ['', Validators.required],
      organizerId: ['', Validators.required],
    });
    this.eventDataForm.get('discountedPrice')?.disable();
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
      .get('esnDiscount')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) {
          this.eventDataForm.get('discountedPrice')?.enable();
        } else {
          this.eventDataForm.get('discountedPrice')?.disable();
        }
      });
    this.eventDataForm
      .get('registrationMode')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        switch (mode) {
          case RegistrationMode.Stripe: {
            this.eventDataForm.get('price')?.enable();
            this.eventDataForm.get('discountedPrice')?.enable();
            this.eventDataForm.get('esnDiscount')?.enable();
            this.eventDataForm.get('registrationLink')?.disable();
            break;
          }
          case RegistrationMode.Online: {
            this.eventDataForm.get('price')?.disable();
            this.eventDataForm.get('discountedPrice')?.disable();
            this.eventDataForm.get('esnDiscount')?.disable();
            this.eventDataForm.get('registrationLink')?.disable();
            break;
          }
          case RegistrationMode.External: {
            this.eventDataForm.get('price')?.disable();
            this.eventDataForm.get('discountedPrice')?.disable();
            this.eventDataForm.get('esnDiscount')?.disable();
            this.eventDataForm.get('registrationLink')?.enable();
            break;
          }
        }
      });
  }

  onSubmit() {
    if (this.eventDataForm.valid) {
      const data = this.eventDataForm.value;
      this.dialog.close({
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
      });
    } else {
      console.info('Cancelling form submission as it was not valid');
      console.log(this.eventDataForm);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }
}
