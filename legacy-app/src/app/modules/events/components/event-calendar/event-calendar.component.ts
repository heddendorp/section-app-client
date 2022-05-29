import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCalendarComponent implements OnChanges {
  @Input() events: EventListQuery['events'] = [];
  public months: {
    month: string;
    year: number;
    weeks: {
      days: {
        date: string;
        notInMonth: boolean;
        events: EventListQuery['events'];
      }[];
    }[];
  }[] = [];
  public weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      const months = [];
      const events = changes['events'].currentValue;
      if (!events) {
        return;
      }
      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];
      const firstDate = DateTime.fromISO(firstEvent.start);
      const lastDate = DateTime.fromISO(lastEvent.end);
      const firstDay = firstDate
        .startOf('month')
        .startOf('week')
        .startOf('day');
      const lastDay = lastDate.endOf('month').endOf('week').startOf('day');
      console.log(firstDate.toLocaleString());
      console.log(firstDay.toLocaleString());
      console.log(lastDay.toLocaleString());
      console.log(Math.ceil(lastDay.diff(firstDay, 'days').days));
      console.log(lastDay.diff(firstDay, 'days').days);
      for (
        let i = 0;
        i <
        Math.ceil(lastDate.diff(firstDate.startOf('month'), 'months').months);
        i++
      ) {
        const currentMonth = firstDate
          .plus({ months: i })
          .startOf('month')
          .startOf('day');
        const month: { month: string; year: number; weeks: any[] } = {
          month: currentMonth.toFormat('MMMM'),
          year: currentMonth.year,
          weeks: [],
        };
        const firstDayOfFirstWeek = currentMonth
          .startOf('month')
          .startOf('week');
        const lastDayOfLastWeek = currentMonth.endOf('month').endOf('week');
        for (
          let j = 0;
          j < lastDayOfLastWeek.diff(firstDayOfFirstWeek, 'weeks').weeks;
          j++
        ) {
          const currentWeek = firstDayOfFirstWeek.plus({ weeks: j });
          const week: {
            days: {
              date: string;
              notInMonth: boolean;
              events: EventListQuery['events'];
            }[];
          } = {
            days: [],
          };
          const firstDayOfWeek = currentWeek.startOf('week');
          const lastDayOfWeek = currentWeek.endOf('week');
          for (
            let k = 0;
            k < lastDayOfWeek.diff(firstDayOfWeek, 'days').days;
            k++
          ) {
            const currentDay = firstDayOfWeek.plus({ days: k });
            const eventsForDay = events.filter(
              (event: EventListQuery['events'][0]) => {
                const start = DateTime.fromISO(event.start);
                // const end = DateTime.fromISO(event.end);
                return start.hasSame(
                  currentDay,
                  'day'
                ) /* || end.hasSame(currentDay, 'day')*/;
              }
            );
            week.days.push({
              date: currentDay.toFormat('dd'),
              notInMonth: currentDay.month !== currentMonth.month,
              events:
                currentDay.month !== currentMonth.month ? [] : eventsForDay,
            });
          }
          month.weeks.push(week);
        }
        months.push(month);
      }
      console.log(months);
      this.months = months;
    }
  }

  public isRegistrationOpen(event: EventListQuery['events'][0]): boolean {
    const registrationStart = DateTime.fromISO(event.registrationStart);

    const now = DateTime.local();
    return now > registrationStart;
  }

  public getId(index: number, event: EventListQuery['events'][0]): string {
    return event.id;
  }
}
