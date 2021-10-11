import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmissionItemType, SubmissionTime } from '@tumi/data-access';

@Component({
  selector: 'tumi-event-submission-dialog',
  templateUrl: './event-submission-dialog.component.html',
  styleUrls: ['./event-submission-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubmissionDialogComponent {
  public newItemForm: FormGroup;
  public SubmissionTime = SubmissionTime;
  public SubmissionItemType = SubmissionItemType;
  constructor(private fb: FormBuilder) {
    this.newItemForm = this.fb.group({
      name: ['', Validators.required],
      instruction: ['', Validators.required],
      submissionTime: ['', Validators.required],
      type: ['', Validators.required],
      required: [true, Validators.required],
    });
  }
}
