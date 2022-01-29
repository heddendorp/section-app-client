import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LoadEventQuery } from '@tumi/data-access';
import { combineLatest, interval, Observable, ReplaySubject } from 'rxjs';
import { DateTime } from 'luxon';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-check-registration-time',
  templateUrl: './check-registration-time.component.html',
  styleUrls: ['./check-registration-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckRegistrationTimeComponent implements OnChanges {
  @Input() public event: LoadEventQuery['event'] | null = null;
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
        return registrationStart.toRelative() ?? '';
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void  {
    if (changes.event) {
      this.registrationStart$.next(
        DateTime.fromISO(changes.event.currentValue.registrationStart)
      );
    }
  }
}
