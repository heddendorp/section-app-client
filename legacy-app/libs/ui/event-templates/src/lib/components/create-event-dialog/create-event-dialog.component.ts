import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GetEventTemplateQuery } from '@tumi/data-access';
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
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { template: GetEventTemplateQuery['eventTemplate'] },
    private fb: FormBuilder,
    private dialog: MatDialogRef<CreateEventDialogComponent>
  ) {
    this.eventDataForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      participantLimit: ['', Validators.required],
      organizerLimit: ['', Validators.required],
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
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }
}
