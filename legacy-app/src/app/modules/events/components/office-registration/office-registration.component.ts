import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AuthService, QrService } from '@tumi/services';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-office-registration',
  templateUrl: './office-registration.component.html',
  styleUrls: ['./office-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeRegistrationComponent implements OnChanges {
  @Input() public event: any;
  public qrURL$ = new Subject();
  public registration$ = new Subject<any>();

  constructor(private auth: AuthService, private qr: QrService) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.event) {
      const user = await this.auth.user$.pipe(first()).toPromise();
      const registrations = await this.event.registrations
        .pipe(first())
        .toPromise();
      const registration = registrations.find((r: any) => r.id === user.id);
      this.registration$.next(registration);
      const qrURL = await this.qr.getURL({
        user: user.id,
        events: [
          { id: this.event.id, action: registration ? 'refund' : 'register' },
        ],
      });
      setTimeout(() => this.qrURL$.next(qrURL));
    }
  }
}
