import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { QrService } from '../../../../services/qr.service';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-office-registration',
  templateUrl: './office-registration.component.html',
  styleUrls: ['./office-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeRegistrationComponent implements OnChanges {
  public QrUrl$ = new Subject();
  @Input() event: any;
  constructor(private auth: AuthService, private qr: QrService) {}
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.event) {
      const user = await this.auth.user$.pipe(first()).toPromise();
      const url = await this.qr.getURL({
        user: user.id,
        events: [{ id: this.event.id, action: 'register' }],
      });
      this.QrUrl$.next(url);
    }
  }
}
