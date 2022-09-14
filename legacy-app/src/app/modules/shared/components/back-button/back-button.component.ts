import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { HISTORY } from '@ng-web-apis/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  @Input() path = '..';

  constructor(
    private router: Router,
    @Inject(HISTORY) private history: History
  ) {}

  async goBack() {
    const state = this.history?.state;
    if (state && state.navigationId && state.navigationId > 1) {
      this.history?.back();
    } else {
      await this.router?.navigateByUrl(this.path);
    }
  }
}
