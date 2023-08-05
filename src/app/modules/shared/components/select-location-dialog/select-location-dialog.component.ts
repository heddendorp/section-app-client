import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LocationAutocompleteComponent } from '../location-autocomplete/location-autocomplete.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-select-location-dialog',
    templateUrl: './select-location-dialog.component.html',
    styleUrls: ['./select-location-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf,
        MatFormFieldModule,
        MatInputModule,
        LocationAutocompleteComponent,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
})
export class SelectLocationDialogComponent {
  public locationControl = new UntypedFormControl(null);
  protected virtualEventControl = new FormControl(false, Validators.required);
  protected meetingUrlControl = new FormControl('');
  public isSaving = false;

  constructor(private dialog: MatDialogRef<SelectLocationDialogComponent>) {}

  submitLocation() {
    this.isSaving = true;
    if (this.virtualEventControl.value) {
      this.dialog.close({
        onlineMeetingUrl: this.meetingUrlControl.value,
        position: {},
        url: null,
        isVirtual: this.virtualEventControl.value,
        structured_formatting: {
          main_text: 'Online Meeting',
        },
      });
      return;
    }
    const value = this.locationControl.value;
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      { placeId: value.place_id, fields: ['url', 'geometry'] },
      (res: any) => {
        this.isSaving = false;
        this.dialog.close({
          ...value,
          url: res.url,
          position: res.geometry.location,
          isVirtual: this.virtualEventControl.value,
          onlineMeetingUrl: null,
        });
      }
    );
  }
}
