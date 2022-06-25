import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TumiEvent } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  @Output() claimRequest = new EventEmitter<String>();
  @Input() isOrganized: boolean = false;
  @Input() events: any[] = new Array<any>();

  ngOnInit(): void {}

  requestClaimDialog() {
    this.claimRequest.emit('');
  }

  isFuture(event: TumiEvent) {
    return DateTime.fromISO(event.end) >= DateTime.now();
  }

  compareEventTime(e1: TumiEvent, e2: TumiEvent) {
    return (
      DateTime.fromISO(e2.start).toMillis() -
      DateTime.fromISO(e1.start).toMillis()
    );
  }

  futureEvents() {
    return this.events
      .filter(this.isFuture)
      .sort((e1, e2) => this.compareEventTime(e2, e1));
  }

  pastEvents() {
    return this.events
      .filter((e) => !this.isFuture(e))
      .sort(this.compareEventTime);
  }
}
