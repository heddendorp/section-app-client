import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  GetUsersQuery,
  MembershipStatus,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserDialogComponent implements OnInit {
  public Role = Role;
  public MembershipStatus = MembershipStatus;
  public updateForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: GetUsersQuery['users'][0] },
    private fb: UntypedFormBuilder,
    private dialog: MatDialogRef<UpdateUserDialogComponent>
  ) {
    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.updateForm.patchValue({
      role: this.data.user.currentTenant?.role,
      status: this.data.user.currentTenant?.status,
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.dialog.close(this.updateForm.value);
    }
  }
}
