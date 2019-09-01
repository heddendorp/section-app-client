import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TumiEvent } from '../../../shared/services/event.service';
import { BehaviorSubject } from 'rxjs';
import { QrService } from '../../../shared/services/qr.service';
import { first, map, tap } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth.service';

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
  isTutor$;

  constructor(private qrService: QrService, private authService: AuthService) {}

  ngOnInit() {
    this.isTutor$ = this.authService.isTutor;
    this.authService.user
      .pipe(
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
