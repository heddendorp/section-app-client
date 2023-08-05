import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LoadEventQuery } from '@tumi/legacy-app/generated/generated';
import { combineLatest, interval, map, Observable, ReplaySubject } from 'rxjs';
import { DateTime } from 'luxon';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-check-registration-time',
    templateUrl: './check-registration-time.component.html',
    styleUrls: ['./check-registration-time.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatIconModule,
        AsyncPipe,
        DatePipe,
        ExtendDatePipe,
    ],
})
export class CheckRegistrationTimeComponent implements OnChanges {
  @Input() public registrationStart: string | null = null;
  public registrationOpen$: Observable<boolean>;
  public remainingTime$: Observable<string>;
  private registrationStart$ = new ReplaySubject<DateTime>(1);
  private interval = interval(1000);

  constructor() {
    this.registrationOpen$ = combineLatest([
      this.interval,
      this.registrationStart$,
    ]).pipe(
      map(([, registrationStart]) => {
        return DateTime.now() > registrationStart;
      })
    );
    this.remainingTime$ = combineLatest([
      this.interval,
      this.registrationStart$,
    ]).pipe(
      map(([, registrationStart]) => {
        const diff = registrationStart.diffNow('days');
        if (diff.days < 1) {
          return diff.toFormat('hh:mm:ss');
        }
        return registrationStart.toRelative() ?? '';
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registrationStart']) {
      this.registrationStart$.next(
        DateTime.fromISO(changes['registrationStart'].currentValue)
      );
    }
  }
}
