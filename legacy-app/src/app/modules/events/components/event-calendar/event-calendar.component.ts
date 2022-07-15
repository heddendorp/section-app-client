import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { EventCalendarDayDialogComponent } from './event-calendar-day-dialog/event-calendar-day-dialog';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCalendarComponent implements OnChanges {
  @Input() events: EventListQuery['events'] = [];
  @Input() firstDate?: DateTime;
  @Input() lastDate?: DateTime;
  public weeks: {
    days: {
      date: string;
      month: string;
      startOfMonth: boolean;
      today: boolean;
      events: EventListQuery['events'];
    }[];
  }[] = [];
  public weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  public numberOfEventsPerCell = 5;

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      const weeks = [];
      const events = changes['events'].currentValue;
      if (!events) {
        return;
      }
      const lastEvent = events[events.length - 1];
      const firstDate = this.firstDate
        ? this.firstDate
        : DateTime.now().startOf('week');
      const lastDate = this.lastDate
        ? this.lastDate
        : DateTime.fromISO(lastEvent.end);
      for (
        let i = 0;
        i < Math.ceil(lastDate.diff(firstDate.startOf('week'), 'week').weeks);
        i++
      ) {
        const currentWeek = firstDate
          .startOf('week')
          .startOf('day')
          .plus({ weeks: i });
        const week: {
          days: {
            date: string;
            month: string;
            today: boolean;
            startOfMonth: boolean;
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
            date: currentDay.toFormat('d'),
            month: currentDay.toFormat('MMM'),
            startOfMonth: currentDay.day === 1,
            today: currentDay.hasSame(DateTime.local(), 'day'),
            events: eventsForDay,
          });
        }
        weeks.push(week);
      }
      // console.log(weeks);
      this.weeks = weeks;
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

  public showDayDialog(events: EventListQuery['events']) {
    if (events.length === 0) return;
    this.dialog.open(EventCalendarDayDialogComponent, {
      width: '600px',
      maxWidth: '100vw',
      data: { events: events },
      autoFocus: false,
      panelClass: 'modern',
    });
  }

  public tutorSpotsClass(event: any) {
    if (!event.couldBeOrganizer) {
      return '';
    }

    if (event.organizersRegistered / event.organizerLimit < 0.1) {
      return 'outline-2 outline-dashed outline-red-500';
    }
    if (event.organizersRegistered >= event.organizerLimit) {
      return '';
    }
    return 'outline-2 outline-dashed outline-yellow-500';
  }
}
