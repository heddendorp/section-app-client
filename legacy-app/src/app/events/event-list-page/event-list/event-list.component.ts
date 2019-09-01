import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TumiEvent } from '../../../shared/services/event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() events: TumiEvent[];
  @Output() details = new EventEmitter<TumiEvent>();
  isTutor$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isTutor$ = this.authService.isTutor;
  }
}
