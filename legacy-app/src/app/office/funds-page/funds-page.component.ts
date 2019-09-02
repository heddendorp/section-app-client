import { Component, OnInit } from '@angular/core';
import { MoneyService } from '../../shared/services/money.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-funds-page',
  templateUrl: './funds-page.component.html',
  styleUrls: ['./funds-page.component.scss']
})
export class FundsPageComponent implements OnInit {
  balance$: Observable<number>;
  transactions$: Observable<any[]>;
  transactionForm: FormGroup;

  constructor(private moneyService: MoneyService, fb: FormBuilder) {
    this.transactionForm = fb.group({
      value: [null, Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.balance$ = this.moneyService.balance;
    this.transactions$ = this.moneyService.transactions.pipe(
      map(data =>
        data.map(transaction => {
          return { ...transaction, absValue: Math.abs(transaction.value) };
        })
      )
    );
  }

  addTransaction() {
    this.moneyService.addTransaction(this.transactionForm.value);
    this.transactionForm.reset();
  }
}
