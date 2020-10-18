import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { QrService } from '../../../../services/qr.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-collect-money',
  templateUrl: './collect-money.component.html',
  styleUrls: ['./collect-money.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectMoneyComponent implements OnChanges {
  public qrURL$ = new Subject();
  @Input() event: any;
  constructor(private auth: AuthService, private qr: QrService) {}
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.event) {
      const user = await this.auth.user$.pipe(first()).toPromise();
      const qrURL = await this.qr.getURL({
        user: user.id,
        events: [{ id: this.event.id, action: 'collectMoney' }],
      });
      this.qrURL$.next(qrURL);
    }
  }
}
