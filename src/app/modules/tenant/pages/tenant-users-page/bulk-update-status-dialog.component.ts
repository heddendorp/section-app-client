import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { MembershipStatus } from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-bulk-update-status-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Bulk update user status</h2>
    <div mat-dialog-content class="mt-2">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>New status</mat-label>
        <mat-select [formControl]="statusControl" required>
          @for (s of statuses; track s) {
            <mat-option [value]="s">{{ s }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="statusControl.invalid"
        (click)="submit()"
        >Update</button
      >
    </div>
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUpdateStatusDialogComponent {
  private dialogRef = inject(
    MatDialogRef<
      BulkUpdateStatusDialogComponent,
      { status: MembershipStatus } | undefined
    >,
  );
  public MembershipStatus = MembershipStatus;
  public statuses = Object.values(MembershipStatus) as MembershipStatus[];
  public statusControl = new FormControl<MembershipStatus | null>(null, {
    nonNullable: false,
    validators: [Validators.required],
  });

  close() {
    this.dialogRef.close(undefined);
  }

  submit() {
    if (this.statusControl.valid && this.statusControl.value) {
      this.dialogRef.close({ status: this.statusControl.value });
    }
  }
}
