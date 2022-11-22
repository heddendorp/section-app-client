import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-location-dialog',
  templateUrl: './select-location-dialog.component.html',
  styleUrls: ['./select-location-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLocationDialogComponent {
  public locationControl = new UntypedFormControl(null, Validators.required);
  public isSaving = false;

  constructor(
    private dialog: MatDialogRef<SelectLocationDialogComponent>,
    private http: HttpClient
  ) {}

  submitLocation() {
    this.isSaving = true;
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
        });
      }
    );
  }
}
