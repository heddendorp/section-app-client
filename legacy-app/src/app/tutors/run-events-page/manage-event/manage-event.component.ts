import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { EventService, TumiEvent } from '../../../shared/services/event.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit {
  event$: Observable<TumiEvent>;
  tutorEmail$: Observable<string>;
  studentEmail$: Observable<string>;

  constructor(private route: ActivatedRoute, private userService: UserService, private eventService: EventService) {}

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap(params => this.userService.getEventWithUsers(params.get('eventId'))),
      startWith(this.route.snapshot.data[0])
    );
    this.tutorEmail$ = this.event$.pipe(map(event => 'mailto:' + event.tutorUsers.map(tutor => tutor.email).join(',')));
    this.studentEmail$ = this.event$.pipe(
      map(
        event =>
          `mailto:?subject=${encodeURIComponent(`[TUMi] ${event.name}`)}&bcc=${event.userSignups
            .map(signup => signup.user.email)
            .join(',')}`
      )
    );
  }
}
