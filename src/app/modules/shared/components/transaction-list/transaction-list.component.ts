import { Component, Input } from '@angular/core';
import { Transaction } from '@tumi/legacy-app/generated/generated';
import { SnakeCasePipe } from '@tumi/legacy-app/modules/shared/pipes/snake-case.pipe';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, MatIconModule, CurrencyPipe, SnakeCasePipe],
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
