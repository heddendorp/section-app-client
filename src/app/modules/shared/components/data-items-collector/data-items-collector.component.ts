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
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  EventSubmissionItem,
  SubmissionItemType,
} from '@tumi/legacy-app/generated/generated';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MarkdownModule } from 'ngx-markdown';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-data-items-collector',
  templateUrl: './data-items-collector.component.html',
  styleUrls: ['./data-items-collector.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    MatFormFieldModule,
    MatInputModule,
    MarkdownModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDividerModule,
  ],
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
  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.form = this.fb.group(
        changes['items'].currentValue.reduce(
          (
            acc: { [id: string]: FormControl },
            item: { id: string; type: SubmissionItemType },
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
                  : [Validators.required],
              ),
            };
          },
          {},
        ),
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
