import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { parse, format } from 'date-fns';

@Component({
  selector: 'app-event-form-dialog',
  templateUrl: './event-form-dialog.component.html',
  styleUrls: ['./event-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormDialogComponent implements OnDestroy {
  public title: string;
  public eventForm: FormGroup;
  private destroyed$ = new Subject();
  public icon$: Observable<string>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { event?: any },
    private dialog: MatDialogRef<EventFormDialogComponent>,
    fb: FormBuilder
  ) {
    this.title = data?.event?.name || 'New Event';
    this.eventForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      runningNotes: ['', Validators.required],
      visibility: ['draft'],
      type: ['event'],
      registrationMode: ['office'],
      tutorSpots: [0, Validators.required],
      participantSpots: [0, Validators.required],
      splitTutorPlaces: [false],
      price: [0, Validators.required],
      fullCost: [0, Validators.required],
      hasFee: [false],
      signupLink: ['', Validators.required],
      icon: ['overtime', Validators.required],
      end: ['', this.checkDateFormat('d.L.y HH:mm')],
      start: ['', this.checkDateFormat('d.L.y HH:mm')],
    });
    this.icon$ =
      this.eventForm.get('icon')?.valueChanges.pipe(debounceTime(200)) ||
      of('');
    this.eventForm.get('price')?.disable();
    this.eventForm
      .get('hasFee')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((hasFee) => {
        if (hasFee) {
          this.eventForm.get('price')?.enable();
        } else {
          this.eventForm.get('price')?.disable();
          this.eventForm.patchValue({ price: 0 });
        }
      });
    this.eventForm
      .get('registrationMode')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        if (mode === 'external') {
          this.eventForm.get('signupLink')?.enable();
        } else {
          this.eventForm.get('signupLink')?.disable();
          this.eventForm.patchValue({ signupLink: null });
        }
      });
    if (data?.event) {
      this.eventForm.patchValue({
        ...data.event,
        start: format(data.event.start, 'd.L.y HH:mm'),
        end: format(data.event.end, 'd.L.y HH:mm'),
      });
    }
  }

  private checkDateFormat(dateFormat: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const date = parse(control.value, dateFormat, new Date());
      return !isNaN(date.valueOf()) ? null : { invalidDate: control.value };
    };
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  async submit(): Promise<void> {
    const bootstrapData = {
      tutorSignups: [],
    };
    const data = this.eventForm.value;
    this.dialog.close({
      ...data,
      ...(this.data ? {} : bootstrapData),
      start: parse(data.start, 'd.L.y HH:mm', new Date()),
      end: parse(data.end, 'd.L.y HH:mm', new Date()),
    });
  }
}
