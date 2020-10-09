/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MoneyService, Transaction } from '../../shared/services/money.service';
import { PDFService } from '../services/pdf.service';

@Component({
  selector: 'app-funds-page',
  templateUrl: './funds-page.component.html',
  styleUrls: ['./funds-page.component.scss'],
})
export class FundsPageComponent implements OnInit {
  balance$: Observable<number>;
  transactions$: Observable<any[]>;
  transactionForm: FormGroup;
  filterForm: FormGroup;

  constructor(private moneyService: MoneyService, fb: FormBuilder, private pdfService: PDFService) {
    this.transactionForm = fb.group({
      value: [null, Validators.required],
      comment: ['', Validators.required],
    });
    this.filterForm = fb.group({
      startDate: moment().subtract(2, 'weeks'),
      endDate: null,
      searchString: '',
    });
  }

  ngOnInit() {
    this.balance$ = this.moneyService.balance;
    const transactions = this.moneyService.transactions.pipe(
      map((data) =>
        data.map((transaction) => {
          return { ...transaction, absValue: Math.abs(transaction.value) };
        }),
      ),
      tap(console.log),
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

  trackById(index, element) {
    return element.id;
  }

  private filterTransactions([transactions, filter]: [
    Transaction[],
    { startDate: moment.Moment; endDate: moment.Moment; searchString: string },
  ]) {
    return transactions.filter((transaction) => {
      if (filter.searchString && !transaction.comment.toLowerCase().includes(filter.searchString.toLowerCase())) {
        return false;
      }
      if (filter.startDate && transaction.timestamp.isBefore(filter.startDate)) {
        return false;
      }
      return !(filter.endDate && transaction.timestamp.isAfter(filter.endDate));
    });
  }
}
