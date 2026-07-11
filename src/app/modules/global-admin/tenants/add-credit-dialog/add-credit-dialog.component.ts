import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

type AddCreditDialogData = {
  tenantName: string;
  currency: string;
};

@Component({
  selector: 'app-add-credit-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-credit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCreditDialogComponent {
  private dialogRef = inject(MatDialogRef<AddCreditDialogComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as AddCreditDialogData;
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.nonNullable.group({
    amount: this.formBuilder.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    description: this.formBuilder.control('', {
      validators: [Validators.maxLength(300)],
    }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const amount = this.form.controls.amount.value;
    if (amount === null || Number.isNaN(amount)) {
      this.form.controls.amount.setErrors({ invalid: true });
      return;
    }
    const description = this.form.controls.description.value?.trim();
    this.dialogRef.close({ amount, description: description || undefined });
  }
}
