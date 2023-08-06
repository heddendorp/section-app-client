import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery, Role } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { IfRoleDirective } from '../../../shared/directives/if-role.directive';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { Price } from '@tumi/legacy-app/utils';

@Component({
    selector: 'app-event-header',
    templateUrl: './event-header.component.html',
    styleUrls: ['./event-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        BackButtonComponent,
        NgIf,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        IfRoleDirective,
        DecimalPipe,
        CurrencyPipe,
        DatePipe,
        ExtendDatePipe,
        IconURLPipe,
    ],
})
export class EventHeaderComponent {
  public Role = Role;
  private hostName = location.hostname;
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Input() public bestPrice: Price | null = null;
  isSingleDayEvent() {
    return (
      this.event &&
      DateTime.fromISO(this.event.start).day ===
        DateTime.fromISO(this.event.end).day
    );
  }
  get canShare() {
    return this.event && !!navigator.share;
  }

  shareEvent() {
    void navigator.share({
      title: this.event?.title,
      text: `Check out this event: ${this.event?.title}`,
      url: `https://${this.hostName}/events/${this.event?.id}`,
    });
  }
}
