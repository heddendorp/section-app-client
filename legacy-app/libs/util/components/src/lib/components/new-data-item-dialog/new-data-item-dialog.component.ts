import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmissionItemType, SubmissionTime } from '@tumi/data-access';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'tumi-new-data-item-dialog',
  templateUrl: './new-data-item-dialog.component.html',
  styleUrls: ['./new-data-item-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDataItemDialogComponent implements OnDestroy {
  public form: FormGroup;
  public SubmissionItemType = SubmissionItemType;
  public SubmissionTime = SubmissionTime;
  private destroyed$ = new Subject();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'event' | 'product' },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      submissionTime: ['', Validators.required],
      required: [true, Validators.required],
      instruction: ['', Validators.required],
      data: this.fb.group({
        choices: this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required),
        ]),
      }),
    });
    this.form.get('data')?.disable();
    this.form
      .get('type')
      ?.valueChanges?.pipe(takeUntil(this.destroyed$))
      ?.subscribe((type: SubmissionItemType) => {
        if (type === SubmissionItemType.Select) {
          this.form.get('data')?.enable();
        } else {
          this.form.get('data')?.disable();
        }
      });
  }

  get choices() {
    return this.form.get('data')?.get('choices') as FormArray;
  }

  addChoice(): void  {
    this.choices.push(this.fb.control('', Validators.required));
  }

  removeChoice(index: number): void  {
    this.choices.removeAt(index);
  }

  ngOnDestroy(): void  {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
