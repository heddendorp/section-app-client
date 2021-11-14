import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EventSubmissionItem, SubmissionItemType } from '@tumi/data-access';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-data-items-collector',
  templateUrl: './data-items-collector.component.html',
  styleUrls: ['./data-items-collector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataItemsCollectorComponent implements OnDestroy, OnChanges {
  @Input() public items: Array<
    Pick<EventSubmissionItem, 'id' | 'instruction' | 'name'> &
      Partial<EventSubmissionItem>
  > = [];
  @Input() mode: 'event' | 'product' = 'event';
  @Output() public dataSubmission = new EventEmitter<unknown>();
  public form: FormGroup | undefined;
  public SubmissionItemType = SubmissionItemType;
  private destroyed = new Subject();
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.form = this.fb.group(
        changes.items.currentValue.reduce(
          (acc: { [id: string]: unknown }, item: { id: string }) => {
            return { ...acc, [item.id]: ['', Validators.required] };
          },
          {}
        )
      );
    }
  }

  public ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  submitData() {
    if (this.form?.valid) {
      this.dataSubmission.emit(this.form.value);
    } else {
      this.snackBar.open('Form is not valid');
    }
  }
}
