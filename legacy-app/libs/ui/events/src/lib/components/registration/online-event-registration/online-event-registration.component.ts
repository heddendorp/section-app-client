import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery, RegisterForEventGQL } from '@tumi/data-access';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tumi-online-event-registration',
  templateUrl: './online-event-registration.component.html',
  styleUrls: ['./online-event-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineEventRegistrationComponent implements OnInit {
  @Input() public event: LoadEventQuery['event'] | null = null;
  public processing = new BehaviorSubject(false);
  constructor(private registerForEvent: RegisterForEventGQL) {}

  ngOnInit(): void {}

  public async register() {
    this.processing.next(true);
    await this.registerForEvent
      .mutate({ eventId: this.event?.id ?? '' })
      .toPromise();
    this.processing.next(false);
  }
}
