import { Component, Input, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../../../../shared/services/auth.service';
import { TumiEvent } from '../../../../shared/services/event.service';
import { QrService } from '../../../../shared/services/qr.service';

@Component({
  selector: 'app-display-event-info',
  templateUrl: './display-event-info.component.html',
  styleUrls: ['./display-event-info.component.scss']
})
export class DisplayEventInfoComponent implements OnInit {
  @Input() event: TumiEvent;
  isTutor;
  qrCode;

  constructor(private qrService: QrService, private authService: AuthService) {}

  async ngOnInit() {
    const userId = await this.authService.user
      .pipe(
        first(),
        map(user => user.id)
      )
      .toPromise();
    this.isTutor = this.event.tutorSignups.includes(userId);
    console.log(
      JSON.stringify({
        action: 'collectMoney',
        user: userId,
        event: this.event.id
      })
    );
    this.qrCode = await this.qrService.getURL({
      action: 'collectMoney',
      user: userId,
      event: this.event.id
    });
  }
}
