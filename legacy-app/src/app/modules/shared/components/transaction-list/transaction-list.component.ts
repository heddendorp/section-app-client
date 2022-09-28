import { Component, Input } from '@angular/core';
import { Transaction } from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  @Input() transactions: Array<
    Required<
      Pick<
        Transaction,
        'id' | 'direction' | 'status' | 'amount' | 'type' | 'subject'
      >
    > & {
      stripePayment?: { id: string; paymentIntent?: string | null } | null;
    }
  > = [];

  constructor() {}
}
