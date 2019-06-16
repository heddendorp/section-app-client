import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../../shared/services/event.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-edit-page',
  templateUrl: './event-edit-page.component.html',
  styleUrls: ['./event-edit-page.component.scss']
})
export class EventEditPageComponent implements OnInit {
  event$: Observable<TumiEvent>;
  title$: Observable<string>;

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) {}

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.eventService.getEvent(id))
    );
    this.title$ = this.event$.pipe(map(event => event.name));
  }

  saveEvent(event) {
    this.eventService.updateEvent(event).then(() => this.router.navigate(['office', 'events']));
  }
}
