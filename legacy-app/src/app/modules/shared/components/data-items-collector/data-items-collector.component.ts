import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  EventSubmissionItem,
  SubmissionItemType,
} from '@tumi/legacy-app/generated/generated';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-data-items-collector',
  templateUrl: './data-items-collector.component.html',
  styleUrls: ['./data-items-collector.component.scss'],
})
export class DataItemsCollectorComponent implements OnDestroy, OnChanges {
  @Input() public items: Array<
    Pick<EventSubmissionItem, 'id' | 'instruction' | 'name' | 'data' | 'type'> &
      Partial<any>
  > = [];
  @Input() mode: 'event' | 'product' = 'event';
  @Output() public dataSubmission = new EventEmitter<unknown>();
  public form: UntypedFormGroup | undefined;
  public SubmissionItemType = SubmissionItemType;
  private destroyed = new Subject();
  constructor(private fb: UntypedFormBuilder, private snackBar: MatSnackBar) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.form = this.fb.group(
        changes['items'].currentValue.reduce(
          (
            acc: { [id: string]: FormControl },
            item: { id: string; type: SubmissionItemType }
          ) => {
            return {
              ...acc,
              [item.id]: new FormControl(
                [
                  SubmissionItemType.Boolean,
                  SubmissionItemType.Confirm,
                ].includes(item.type)
                  ? false
                  : '',
                item.type === SubmissionItemType.Confirm
                  ? [Validators.requiredTrue]
                  : [Validators.required]
              ),
            };
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

  submitData(): void {
    if (this.form?.valid) {
      this.dataSubmission.emit(this.form.value);
    } else {
      this.snackBar.open('Form is not valid');
    }
  }
}
