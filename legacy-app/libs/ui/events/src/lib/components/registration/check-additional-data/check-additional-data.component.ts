import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LoadEventQuery, SubmissionItemType } from '@tumi/data-access';
import { ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-check-additional-data',
  templateUrl: './check-additional-data.component.html',
  styleUrls: ['./check-additional-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckAdditionalDataComponent implements OnChanges {
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Output() public dataSubmission = new EventEmitter<unknown>();
  public needsInput$ = new ReplaySubject<boolean>(1);
  public incompleteItems$ = new ReplaySubject<
    LoadEventQuery['event']['submissionItems']
  >(1);
  public inputForm = new FormGroup({});
  public SubmissionItemType = SubmissionItemType;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.event) {
      const event = changes.event.currentValue as LoadEventQuery['event'];
      if (event.activeRegistration) {
        this.needsInput$.next(false);
        return;
      }
      if (event && event.submissionItems.length) {
        this.needsInput$.next(true);
        this.incompleteItems$.next(
          event.submissionItems.filter(
            (item) => item.ownSubmissions.length === 0
          )
        );
        this.inputForm = this.fb.group(
          event.submissionItems
            .filter((item) => item.ownSubmissions.length === 0)
            .reduce((acc, item) => {
              return { ...acc, [item.id]: ['', Validators.required] };
            }, {})
        );
      }
    }
  }

  async submitData() {
    if (this.inputForm.valid) {
      this.dataSubmission.emit(this.inputForm.value);
      this.needsInput$.next(false);
    } else {
      this.snackBar.open('Form is not valid');
    }
  }
}
