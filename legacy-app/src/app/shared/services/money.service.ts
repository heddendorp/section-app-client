import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .add({ ...transaction, timestamp: moment().toDate() });
  }
}

interface BaseTransaction {
  id: string;
  value: number;
  comment: string;
}

interface StoredTransaction extends BaseTransaction {
  timestamp: firestore.Timestamp;
}

export interface Transaction extends BaseTransaction {
  timestamp: moment.Moment;
  absValue?: number;
}
