import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-transaction-dialog',
  templateUrl: './new-transaction-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTransactionDialogComponent {
  public transactionForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.transactionForm = fb.group({
      comment: ['', Validators.required],
      value: [0, Validators.required],
    });
  }
}
