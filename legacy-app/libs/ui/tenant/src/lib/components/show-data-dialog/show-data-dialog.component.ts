import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetLogsQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-show-data-dialog',
  templateUrl: './show-data-dialog.component.html',
  styleUrls: ['./show-data-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDataDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: GetLogsQuery['logs'][0]) {}

  get customer1() {
    if (this.data?.data?.customer) {
      return `https://dashboard.stripe.com/customers/${this.data.data.customer}`;
    }
    return null;
  }

  get customer2() {
    if (this.data?.oldData?.customer) {
      return `https://dashboard.stripe.com/customers/${this.data.data.customer}`;
    }
    return null;
  }

  get payment1() {
    if (this.data?.data?.object === 'payment_intent') {
      return `https://dashboard.stripe.com/payments/${this.data.data.id}`;
    }
    if (this.data?.data?.payment_intent) {
      return `https://dashboard.stripe.com/payments/${this.data.data.payment_intent}`;
    }
    return null;
  }

  get payment2() {
    if (this.data?.oldData?.object === 'payment_intent') {
      return `https://dashboard.stripe.com/payments/${this.data.oldData.id}`;
    }
    if (this.data?.oldData?.payment_intent) {
      return `https://dashboard.stripe.com/payments/${this.data.oldData.payment_intent}`;
    }
    return null;
  }

  get event1() {
    if (this.data?.data?.eventId) {
      return `/events/${this.data.data.eventId}`;
    }
    return null;
  }

  get event2() {
    if (this.data?.oldData?.eventId) {
      return `/events/${this.data.oldData.eventId}`;
    }
    return null;
  }

  get user1() {
    if (this.data?.data?.userId) {
      return `/tenant/users/${this.data.data.userId}`;
    }
    return null;
  }

  get user2() {
    if (this.data?.oldData?.userId) {
      return `/tenant/users/${this.data.oldData.userId}`;
    }
    return null;
  }
}
