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
  selector: 'app-update-user-information-dialog',
  templateUrl: './update-user-information-dialog.component.html',
  styleUrls: ['./update-user-information-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserInformationDialogComponent {
  public profileForm: UntypedFormGroup;
  public EnrolmentStatus = EnrolmentStatus;

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialogRef<UpdateUserInformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { profile: UserProfileQuery['currentUser'] }
  ) {
    this.profileForm = this.fb.group({
      enrolmentStatus: ['', Validators.required],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\s*[+]\s*([0-9]\s*)+$/),
        ]),
      ], // Allow spaces in validation, strip them server-side
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
