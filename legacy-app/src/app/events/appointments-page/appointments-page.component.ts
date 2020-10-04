import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { AuthState } from '../../shared/state/auth.state';
import { Observable } from 'rxjs';
import { EventsState } from '../../shared/state/events.state';
import { TumiEvent } from '../../shared/services/event.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-appointments-page',
  templateUrl: './appointments-page.component.html',
  styleUrls: ['./appointments-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsPageComponent {
  @Select(AuthState.profileIncomplete) incompleteProfile$: Observable<boolean>;
  @Select(EventsState.appointments) events$: Observable<TumiEvent[]>;
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;
  public days$: Observable<{ date: string; events: TumiEvent[] }[]> = this.events$.pipe(
    map((events) => {
      const days: { date: string; events: TumiEvent[] }[] = [];
      let currentDay = '';
      events.forEach((event) => {
        if (currentDay === event.start.format('DDDD')) {
          days[days.length - 1].events.push(event);
        } else {
          days.push({
            date: event.start.format('ddd Do MMMM'),
            events: [event],
          });
          currentDay = event.start.format('DDDD');
        }
      });
      return days;
    }),
  );
  getId(index, event: TumiEvent) {
    return event.id;
  }
}
