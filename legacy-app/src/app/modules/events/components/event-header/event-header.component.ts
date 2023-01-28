import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery, Role } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { Price } from '../../../../../../../shared/data-types';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHeaderComponent {
  public Role = Role;
  private hostName = location.hostname;
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Input() public bestPrice: Price | null = null;
  isSingleDayEvent() {
    return (
      this.event &&
      DateTime.fromISO(this.event.start).day ===
        DateTime.fromISO(this.event.end).day
    );
  }
  get canShare() {
    return this.event && !!navigator.share;
  }

  shareEvent() {
    void navigator.share({
      title: this.event?.title,
      text: `Check out this event: ${this.event?.title}`,
      url: `https://${this.hostName}/events/${this.event?.id}`,
    });
  }
}
