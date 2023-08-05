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
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-update-user-dialog',
    templateUrl: './update-user-dialog.component.html',
    styleUrls: ['./update-user-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        MatButtonModule,
        TitleCasePipe,
    ],
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
      position: [''],
    });
    console.log(this.data.user);
    this.updateForm.patchValue({
      role: this.data.user.currentTenant?.role,
      status: this.data.user.currentTenant?.status,
      position: this.data.user.position,
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.dialog.close(this.updateForm.value);
    }
  }
}
