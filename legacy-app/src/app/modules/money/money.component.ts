import { Component } from '@angular/core';
import { MoneyService } from '../../services/money.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewTransactionDialogComponent } from './components/new-transaction-dialog/new-transaction-dialog.component';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
})
export class MoneyComponent {
  public balance$: Observable<number>;
  public transactions$: Observable<any[]>;
  constructor(private money: MoneyService, private dialog: MatDialog) {
    this.balance$ = money.getBalance();
    this.transactions$ = money.getTransactions();
  }
  public getId(_: any, item: any): string {
    return item.id;
  }
  public async addTransaction(): Promise<void> {
    const transaction = await this.dialog
      .open(NewTransactionDialogComponent)
      .afterClosed()
      .toPromise();
    if (transaction) {
      await this.money.addTransaction(transaction);
    }
  }
}
