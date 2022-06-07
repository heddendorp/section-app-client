import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-finance-entry-dialog',
  templateUrl: './new-finance-entry-dialog.component.html',
  styleUrls: ['./new-finance-entry-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewFinanceEntryDialogComponent implements OnDestroy, OnInit {
  public expenseForm: UntypedFormGroup;
  private destroyed$ = new Subject();
  constructor(private fb: UntypedFormBuilder) {
    this.expenseForm = this.fb.group({
      value: ['', Validators.required],
      scale: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      details: [''],
      prepaid: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.expenseForm.get('scale')?.disable();
    this.expenseForm
      .get('type')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((type) => {
        if (type === 'scaled') {
          this.expenseForm.get('scale')?.enable();
        } else {
          this.expenseForm.get('scale')?.disable();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
