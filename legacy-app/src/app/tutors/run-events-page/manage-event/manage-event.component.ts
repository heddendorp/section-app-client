import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../../shared/services/event.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit {
  event$: Observable<TumiEvent>;

  constructor(private route: ActivatedRoute, private userService: UserService, private eventService: EventService) {}

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap(params => this.userService.getEventWithUsers(params.get('eventId'))),
      startWith(this.route.snapshot.data[0])
    );
  }
}
