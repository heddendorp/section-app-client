import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  EventSubmission,
  EventSubmissionItem,
} from '@tumi/legacy-app/generated/generated';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-submission-overview',
  templateUrl: './event-submission-overview.component.html',
  styleUrls: ['./event-submission-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, AsyncPipe],
})
export class EventSubmissionOverviewComponent implements OnChanges {
  @Input() registrations: Required<{
    submissions: Required<
      Pick<EventSubmission, 'data'> & { submissionItem: { id: string } }
    >[];
  }>[] = [];
  @Input() submissionItems: Required<
    Pick<EventSubmissionItem, 'id' | 'name'>
  >[] = [];

  private registrations$ = new BehaviorSubject<
    Required<{
      submissions: Required<
        Pick<EventSubmission, 'data'> & { submissionItem: { id: string } }
      >[];
    }>[]
  >([]);

  private submissionItems$ = new BehaviorSubject<
    Required<Pick<EventSubmissionItem, 'id' | 'name'>>[]
  >([]);

  public registrationStats$: Observable<any[]>;

  constructor() {
    this.registrationStats$ = combineLatest([
      this.registrations$,
      this.submissionItems$,
    ]).pipe(
      map(([registrations, submissionItems]) => {
        return submissionItems.map((submissionItem) => {
          const submissionItemName = submissionItem.name;
          const choices = registrations.map((registration) => {
            const submission = registration.submissions.find(
              (submission) =>
                submission.submissionItem.id === submissionItem.id,
            );
            return submission ? submission.data.value : '';
          });
          // Calculate the number of times each choice was selected
          const choiceCounts = choices.reduce(
            (acc, choice) => {
              if (typeof acc[choice] === 'undefined') {
                acc[choice] = 1;
              } else {
                acc[choice] += 1;
              }
              return acc;
            },
            {} as Record<string, number>,
          );
          return {
            submissionItemName,
            choiceCounts: Object.entries(choiceCounts).map(
              ([choice, count]) => ({
                choice,
                count,
              }),
            ),
          };
        });
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['registrations']) {
      const registrations = changes['registrations'].currentValue;
      if (registrations) {
        this.registrations$.next(registrations);
      }
    }
    if (changes['submissionItems']) {
      const submissionItems = changes['submissionItems'].currentValue;
      if (submissionItems) {
        this.submissionItems$.next(submissionItems);
      }
    }
  }
}
