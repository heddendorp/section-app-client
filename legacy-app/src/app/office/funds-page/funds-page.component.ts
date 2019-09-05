import { Component, OnInit } from '@angular/core';
import { MoneyService, Transaction } from '../../shared/services/money.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { PDFService } from '../../shared/services/pdf.service';

@Component({
  selector: 'app-funds-page',
  templateUrl: './funds-page.component.html',
  styleUrls: ['./funds-page.component.scss']
})
export class FundsPageComponent implements OnInit {
  balance$: Observable<number>;
  transactions$: Observable<any[]>;
  transactionForm: FormGroup;
  filterForm: FormGroup;

  constructor(private moneyService: MoneyService, fb: FormBuilder, private pdfService: PDFService) {
    this.transactionForm = fb.group({
      value: [null, Validators.required],
      comment: ['', Validators.required]
    });
    this.filterForm = fb.group({
      startDate: null,
      endDate: null,
      searchString: ''
    });
  }

  ngOnInit() {
    this.balance$ = this.moneyService.balance;
    const transactions = this.moneyService.transactions.pipe(
      map(data =>
        data.map(transaction => {
          return { ...transaction, absValue: Math.abs(transaction.value) };
        })
      )
    );
    const filter = this.filterForm.valueChanges.pipe(startWith(this.filterForm.value));
    this.transactions$ = combineLatest([transactions, filter]).pipe(map(this.filterTransactions));
  }

  addTransaction() {
    this.moneyService.addTransaction(this.transactionForm.value);
    this.transactionForm.reset();
  }

  getReceipt(transaction) {
    this.pdfService.getInvoice(transaction);
  }

  private filterTransactions([transactions, filter]: [
    Transaction[],
    { startDate: moment.Moment; endDate: moment.Moment; searchString: string }
  ]) {
    return transactions.filter(transaction => {
      if (filter.searchString && !transaction.comment.toLowerCase().includes(filter.searchString.toLowerCase())) {
        return false;
      }
      if (filter.startDate && transaction.timestamp.isBefore(filter.startDate)) {
        return false;
      }
      if (filter.endDate && transaction.timestamp.isAfter(filter.endDate)) {
        return false;
      }
      return true;
    });
  }
}
