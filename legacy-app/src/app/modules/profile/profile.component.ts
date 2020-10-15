import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public events$: Observable<any[]>;
  constructor(eventService: EventService) {
    this.events$ = eventService.getEventsForCurrentUser();
  }
}
