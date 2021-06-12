import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '@tumi/services';
import { Observable } from 'rxjs';
import { allTypes } from '@tumi/modules/shared';
import { User } from '@tumi/models';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDialogComponent {
  public profileForm: FormGroup;
  public countries$: Observable<any[]>;
  public types = allTypes;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    fb: FormBuilder,
    countries: CountryService
  ) {
    this.profileForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      iban: [''],
      address: ['', Validators.required],
      email: ['', Validators.required],
      type: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.countries$ = countries.getAll();
    this.profileForm.patchValue(data);
  }
}
