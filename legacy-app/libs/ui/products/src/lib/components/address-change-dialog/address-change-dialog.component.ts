import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tumi-address-change-dialog',
  templateUrl: './address-change-dialog.component.html',
  styleUrls: ['./address-change-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressChangeDialogComponent {
  public addressForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      address?: {
        city?: string;
        country?: string;
        line1?: string;
        line2?: string;
        postal_code?: string;
        state?: string;
      };
    },
    private fb: FormBuilder
  ) {
    this.addressForm = this.fb.group({
      city: ['', Validators.required],
      country: [
        '',
        [Validators.maxLength(2), Validators.required, Validators.minLength(2)],
      ],
      line1: ['', Validators.required],
      line2: [''],
      postal_code: ['', Validators.required],
      state: [''],
    });
    this.addressForm.patchValue(this.data.address ?? {});
  }
}
