import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import Timestamp = firebase.firestore.Timestamp;

export class OnlineTransaction {
  constructor(
    private store: AngularFirestore,
    readonly id: string,
    readonly userId: string,
    readonly orderId: string,
    readonly _timestamp: Timestamp
  ) {}
  static get attributes(): string[] {
    return ['rating', 'comment', 'timestamp'];
  }
  static getConverter(
    store: AngularFirestore
  ): FirestoreDataConverter<OnlineTransaction> {
    return {
      toFirestore: (
        modelObject: OnlineTransaction
      ): firebase.firestore.DocumentData => {
        const transaction = pick(modelObject, OnlineTransaction.attributes);
        return pickBy(transaction, negate(isNil));
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): OnlineTransaction => {
        const data = snapshot.data(options);
        return new OnlineTransaction(
          store,
          snapshot.id,
          data.userId,
          data.orderId,
          data.timestamp
        );
      },
    };
  }

  static collection(firestore: AngularFirestore) {
    return firestore.firestore
      .collection('transactions')
      .withConverter(OnlineTransaction.getConverter(firestore));
  }

  get timestamp(): Date {
    return this._timestamp.toDate();
  }
}

export enum TransactionType {
  membershipFee = 'MEMBERSHIP_FEE',
}
