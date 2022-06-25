import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  EnrolmentStatus,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: ['./update-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileDialogComponent {
  public profileForm: UntypedFormGroup;
  public EnrolmentStatus = EnrolmentStatus;

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialogRef<UpdateProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { profile: UserProfileQuery['currentUser'] }
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      university: ['', Validators.required],
      enrolmentStatus: ['', Validators.required],
      phone: ['', Validators.pattern(/^\s*[+]\s*([0-9]\s*)+$/)], // Allow spaces in validation, strip them server-side
    });
    this.profileForm.patchValue({ ...this.data.profile });
  }

  submit(): void {
    if (this.profileForm.valid) {
      this.dialog.close({
        ...this.profileForm.value,
        phone: this.profileForm.value.phone || null,
      });
    }
  }
}
