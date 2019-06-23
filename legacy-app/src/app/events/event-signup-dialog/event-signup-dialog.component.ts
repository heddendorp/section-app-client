import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TumiEvent } from '../../shared/services/event.service';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-signup-dialog',
  templateUrl: './event-signup-dialog.component.html',
  styleUrls: ['./event-signup-dialog.component.scss']
})
export class EventSignupDialogComponent implements OnInit {
  event: TumiEvent;
  signedUp$: Observable<boolean>;
  codeData$: Observable<string>;

  constructor(@Inject(MAT_DIALOG_DATA) data: { event: TumiEvent }, private authService: AuthService) {
    this.event = data.event;
  }

  ngOnInit() {
    this.signedUp$ = this.authService.signedUp;
    this.codeData$ = this.authService.user.pipe(
      tap(console.log),
      map(user =>
        JSON.stringify({
          action: 'register',
          user: user.id,
          event: this.event.id
        })
      )
    );
  }
}
