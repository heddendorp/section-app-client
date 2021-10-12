import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { GetEventTemplateQuery } from '@tumi/data-access';

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
    @Inject(MAT_DIALOG_DATA)
    public data?: { template?: GetEventTemplateQuery['eventTemplate'] }
  ) {
    this.dialogForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['', Validators.required],
      description: ['', Validators.required],
      comment: ['', Validators.required],
      location: [null, Validators.required],
      duration: ['', Validators.required],
      participantText: ['', Validators.required],
      participantMail: ['' /*, Validators.required*/],
      organizerText: ['', Validators.required],
    });
    this.iconFieldValue = this.dialogForm.get('icon')?.valueChanges ?? of('');
    if (this.data?.template) {
      this.dialogForm.patchValue(this.data.template, { emitEvent: true });
      this.dialogForm.get('location')?.disable();
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.dialogForm.valid) {
      const templateValue = this.dialogForm.value;
      if (!templateValue.location?.id) {
        if (this.data?.template) {
          templateValue.location = this.data.template.location;
          templateValue.coordinates = this.data.template.coordinates;
        } else {
          console.error('Location resolve not possible');
          return;
        }
      } else {
        templateValue.coordinates = templateValue.location.position;
        templateValue.location =
          templateValue.location.type === 'POI'
            ? templateValue.location.poi.name
            : templateValue.location.address.freeformAddress;
      }
      this.dialog.close(templateValue);
    } else {
      console.info('Cancelling form submission as it was not valid');
    }
  }
}
