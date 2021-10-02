import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileQuery } from '@tumi/data-access';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'tumi-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: ['./update-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileDialogComponent implements OnInit {
  public profileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<UpdateProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { profile: UserProfileQuery['currentUser'] }
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.pattern(/^[+][0-9]+$/)],
    });
    this.profileForm.patchValue({ ...this.data.profile });
  }

  ngOnInit(): void {}

  submit() {
    if (this.profileForm.valid) {
      this.dialog.close({
        ...this.profileForm.value,
        phone: this.profileForm.value.phone || null,
      });
    }
  }
}
