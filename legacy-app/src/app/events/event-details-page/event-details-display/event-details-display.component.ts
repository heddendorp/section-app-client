import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth.service';
import { TumiEvent } from '../../../shared/services/event.service';
import { QrService } from '../../../shared/services/qr.service';

@Component({
  selector: 'app-event-details-display',
  templateUrl: './event-details-display.component.html',
  styleUrls: ['./event-details-display.component.scss']
})
export class EventDetailsDisplayComponent implements OnInit {
  @Input() event: TumiEvent;
  @Input() signed: boolean;
  @Output() tutorSignup = new EventEmitter();
  @Output() studentSignup = new EventEmitter();
  qrCode = new BehaviorSubject(null);
  eventFull: boolean;
  isTutor$;
  isAuthenticated$;
  email$;

  constructor(private qrService: QrService, private authService: AuthService) {}

  get tutorList() {
    return this.event.tutorUsers.map(user => `${user.firstName} ${user.lastName}`).join(', ');
  }

  ngOnInit() {
    this.eventFull = this.event.usersSignedUp >= this.event.participantSpots && !this.event.isInternal;
    this.isTutor$ = this.authService.isTutor;
    this.isAuthenticated$ = this.authService.authenticated;
    this.email$ = this.authService.user.pipe(map(user => user.email));
    this.authService.user
      .pipe(
        filter(user => !!user),
        tap(user =>
          console.log(
            JSON.stringify({
              action: 'register',
              user: user.id,
              event: this.event.id
            })
          )
        ),
        first()
      )
      .subscribe(user =>
        this.qrService
          .getURL({
            action: 'register',
            user: user.id,
            event: this.event.id
          })
          .then(url => this.qrCode.next(url))
      );
  }
}
