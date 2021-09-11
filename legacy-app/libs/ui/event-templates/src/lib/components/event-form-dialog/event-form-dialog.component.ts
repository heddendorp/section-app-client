import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'tumi-event-form-dialog',
  templateUrl: './event-form-dialog.component.html',
  styleUrls: ['./event-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormDialogComponent implements OnInit {
  public dialogForm: FormGroup;
  public iconFieldValue: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<EventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialog?: any }
  ) {
    this.dialogForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['', Validators.required],
      description: ['', Validators.required],
      location: [null, Validators.required],
      duration: ['', Validators.required],
      participantText: ['', Validators.required],
      participantMail: ['' /*, Validators.required*/],
      organizerText: ['', Validators.required],
    });
    this.iconFieldValue = this.dialogForm.get('icon')?.valueChanges ?? of('');
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.dialogForm.valid) {
      const templateValue = this.dialogForm.value;
      this.dialog.close({
        ...templateValue,
        location:
          templateValue.location.type === 'POI'
            ? templateValue.location.poi.name
            : templateValue.location.address.freeformAddress,
        locationId: templateValue.location.id,
      });
    } else {
      console.info('Cancelling form submission as it was not valid');
    }
  }
}
