import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { EventService } from '../../../../services/event.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventParticipantsComponent implements OnInit {
  @Input() event: any;
  constructor(private eventService: EventService) {}

  ngOnInit(): void {}

  async toggleRegistration(registration: any): Promise<void> {
    await this.eventService.updateRegistration(this.event.id, registration.id, {
      hasAttended: !registration.hasAttended,
    });
  }

  public async removeRegitstration(id: string): Promise<void> {
    await this.eventService.removeRegistration(this.event.id, id);
  }

  stopPropagation($event: MouseEvent): void {
    $event.stopImmediatePropagation();
  }
}
