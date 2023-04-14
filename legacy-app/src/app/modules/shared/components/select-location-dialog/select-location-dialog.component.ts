import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-location-dialog',
  templateUrl: './select-location-dialog.component.html',
  styleUrls: ['./select-location-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
