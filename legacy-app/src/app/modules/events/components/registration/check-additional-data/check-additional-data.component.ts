import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LoadEventQuery } from '@tumi/legacy-app/generated/generated';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-check-additional-data',
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

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      const event = changes['event'].currentValue as LoadEventQuery['event'];
      if (event && event.activeRegistration) {
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
      }
    }
  }

  async submitData(data: unknown) {
    this.dataSubmission.emit(data);
    this.needsInput$.next(false);
  }
}
