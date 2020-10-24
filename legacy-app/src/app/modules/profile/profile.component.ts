import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public events$: Observable<any[]>;
  public tutorEvents$: Observable<any[]>;
  public isTutor$: Observable<boolean>;
  constructor(eventService: EventService, auth: AuthService) {
    this.events$ = eventService.getEventsForCurrentUser();
    this.tutorEvents$ = eventService.getEventsForCurrentTutor();
    this.isTutor$ = auth.isTutor$;
  }
}
