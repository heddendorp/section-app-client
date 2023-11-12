import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-new-finance-entry-dialog',
  templateUrl: './new-finance-entry-dialog.component.html',
  styleUrls: ['./new-finance-entry-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
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
      notSubsidized: [false, Validators.required],
      onInvoice: [false, Validators.required],
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
