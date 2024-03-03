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
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatRippleModule } from '@angular/material/core';
import { LowerCasePipe, NgFor, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatRippleModule,
    LowerCasePipe,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
export class EventCalendarComponent implements OnChanges {
  @Input() events: EventListQuery['events'] | null = null;
  @Input() firstDate?: DateTime;
  @Input() lastDate?: DateTime;
  public weeks:
    | {
        days: {
          date: string;
          month: string;
          startOfMonth: boolean;
          today: boolean;
          events: (EventListQuery['events'][0] & { daySpan: number })[];
        }[];
      }[]
    | null = null;
  public weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  public numberOfEventsPerCell = 5;

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['events']) {
      return;
    }
    const events = changes['events'].currentValue;
    if (!events) {
      return;
    }
    const weeks = [];
    const lastEvent = events[events.length - 1];
    const firstDate = this.firstDate
      ? this.firstDate
      : DateTime.now().startOf('week');
    const lastDate = this.lastDate
      ? this.lastDate
      : DateTime.fromISO(lastEvent.end);
    const multiDayEvents = new Map<string, number>();
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
          events: (EventListQuery['events'][0] & { daySpan: number })[];
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
        const indexMoveMap = new Map<string, number>();
        const eventsForDay = events
          .filter((event: EventListQuery['events'][0]) => {
            const start = DateTime.fromISO(event.start);
            const end = DateTime.fromISO(event.end);
            // return events which overlap with the current day
            return (
              end >= currentDay.plus({ minutes: 1 }) &&
              start <= currentDay.endOf('day')
            );
          })
          .map((event: EventListQuery['events'][0], index: number) => {
            const dayStart = DateTime.fromISO(event.start).startOf('day');
            const dayEnd = DateTime.fromISO(event.end)
              .minus({ minutes: 1 })
              .endOf('day');
            let calendarDays = Math.round(dayEnd.diff(dayStart, 'days').days);
            let dayIndex = null;
            let daySpan = 1;

            if (calendarDays > 1) {
              // if this day is a Monday, reset index
              if (currentDay.weekday === 1 || !multiDayEvents.has(event.id)) {
                multiDayEvents.set(event.id, index);
                calendarDays = Math.round(
                  (lastDayOfWeek < dayEnd ? lastDayOfWeek : dayEnd).diff(
                    dayStart < firstDayOfWeek ? firstDayOfWeek : dayStart,
                    'days',
                  ).days,
                );
                daySpan = calendarDays;
              } else {
                daySpan = 0;
              }
              indexMoveMap.set(
                event.id,
                multiDayEvents.get(event.id) as number,
              );
            }

            return { ...event, index: dayIndex, daySpan };
          });
        // reorder so the events are correctly sorted by index
        for (const [eventId, newIndex] of indexMoveMap) {
          eventsForDay.splice(
            newIndex,
            0,
            eventsForDay.splice(
              eventsForDay.findIndex(
                (event: EventListQuery['events'][0]) => event.id === eventId,
              ),
              1,
            )[0],
          );
        }

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
    this.weeks = weeks;
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
    const sortedEvents = [...events];
    sortedEvents.sort((a, b) =>
      a.start < b.start ? -1 : a.start > b.start ? 1 : 0,
    );
    this.dialog.open(EventCalendarDayDialogComponent, {
      width: '600px',
      maxWidth: '100vw',
      data: { events: sortedEvents },
      autoFocus: false,
    });
  }

  public tutorSpotsClass(event: any) {
    if (event.internalEvent) {
      return 'outline-2 outline outline-blue-500';
    }

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
