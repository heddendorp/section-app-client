/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
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

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore as importStore } from 'firebase/app';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TumiEvent } from './event.service';
import { Student } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {
  constructor(private firestore: AngularFirestore) {}

  public get balance(): Observable<number> {
    return this.firestore
      .collection('stats')
      .doc<{ balance: number }>('money')
      .valueChanges()
      .pipe(map(data => data.balance));
  }

  public get transactions(): Observable<Transaction[]> {
    return this.firestore
      .collection('stats')
      .doc('money')
      .collection<StoredTransaction>('transactions', ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(data =>
          data.map(transaction => {
            return { ...transaction, timestamp: moment(transaction.timestamp.toDate()) };
          })
        )
      );
  }

  public addTransaction(transaction) {
    this.firestore
      .collection('stats')
      .doc('money')
      .collection('transactions')
      .add({ value: transaction.value, comment: transaction.comment, type: 'general', timestamp: moment().toDate() });
  }

  public addEventTransaction(
    comment: string,
    event: TumiEvent,
    user: Student,
    type: 'registration' | 'onLocationPayment' | 'refund' | 'moneyCollection'
  ) {
    let value = 0;
    switch (type) {
      case 'registration': {
        value = event.price;
        break;
      }
      case 'onLocationPayment': {
        value = event.price;
        break;
      }
      case 'refund': {
        value = -event.price;
        break;
      }
      case 'moneyCollection': {
        value = -event.fullCost;
        break;
      }
    }
    this.firestore
      .collection('stats')
      .doc('money')
      .collection('transactions')
      .add({
        comment,
        type,
        value,
        timestamp: new Date(),
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        event: {
          id: user.id,
          name: event.name,
          price: event.price,
          fullCost: event.fullCost,
          start: event.start.toDate(),
          end: event.end.toDate()
        }
      });
  }
}

interface BaseTransaction {
  id: string;
  value: number;
  comment: string;
  type: string;
  user?: Partial<Student>;
  event?: Partial<TumiEvent>;
}

interface StoredTransaction extends BaseTransaction {
  timestamp: importStore.Timestamp;
}

export interface Transaction extends BaseTransaction {
  timestamp: moment.Moment;
  absValue?: number;
}
