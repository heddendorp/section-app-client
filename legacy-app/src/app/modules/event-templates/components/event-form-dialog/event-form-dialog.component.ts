import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { GetEventTemplateQuery } from '@tumi/legacy-app/generated/generated';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-event-form-dialog',
  templateUrl: './event-form-dialog.component.html',
  styleUrls: ['./event-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormDialogComponent {
  public dialogForm: UntypedFormGroup;
  public iconFieldValue: Observable<string>;

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialogRef<EventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      template?: GetEventTemplateQuery['eventTemplate'];
      categories?: { id: string; name: string }[];
    }
  ) {
    this.dialogForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['', Validators.required],
      description: ['TBD', Validators.required],
      comment: ['TBD', Validators.required],
      location: [null, Validators.required],
      duration: ['', Validators.required],
      participantText: ['TBD', Validators.required],
      organizerText: ['TBD', Validators.required],
      insuranceDescription: ['', Validators.required],
      shouldBeReportedToInsurance: [true, Validators.required],
      categoryId: [null, Validators.required],
    });
    this.iconFieldValue = this.dialogForm.get('icon')?.valueChanges ?? of('');
    if (!this.data?.categories) {
      this.dialogForm.get('categoryId')?.disable();
    }
    if (this.data?.template) {
      this.dialogForm.patchValue(this.data.template, { emitEvent: true });
      this.dialogForm.get('location')?.disable();
    }
  }

  onSubmit(): void {
    if (this.dialogForm.valid) {
      const templateValue = this.dialogForm.value;
      console.log(templateValue.location);
      if (templateValue.location?.place_id) {
        // templateValue.coordinates = templateValue.location.position;
        const map = new google.maps.Map(document.createElement('div'));
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: templateValue.location.place_id,
            fields: ['url', 'geometry'],
          },
          (res: any) => {
            this.dialog.close({
              ...templateValue,
              coordinates: res.geometry.location,
              googlePlaceId: templateValue.location.place_id,
              googlePlaceUrl: res.url,
              location: templateValue.location.structured_formatting.main_text,
            });
          }
        );
      } else {
        this.dialog.close(templateValue);
      }
    } else {
    }
  }
}
