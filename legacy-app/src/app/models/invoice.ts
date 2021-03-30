import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import Timestamp = firebase.firestore.Timestamp;

export class Invoice {
  readonly timestamp: Date;

  constructor(
    private store: AngularFirestore,
    readonly id: string,
    timestamp: Timestamp,
    readonly email: string,
    readonly userId: string,
    readonly items: InvoiceItem[],
    readonly lastStripeEvent?: string,
    readonly stripeInvoiceUrl?: string,
    readonly stripeInvoiceStatus?:
      | 'draft'
      | 'open'
      | 'uncollectible'
      | 'void'
      | 'paid',
    readonly daysUntilDue?: number
  ) {
    this.timestamp = timestamp.toDate();
    console.log(this);
  }
  static get attributes(): string[] {
    return ['email', 'userId', 'items', 'timestamp'];
  }
  static getConverter(
    store: AngularFirestore
  ): FirestoreDataConverter<Invoice> {
    return {
      toFirestore: (modelObject: Invoice): firebase.firestore.DocumentData => {
        const vote = pick(modelObject, Invoice.attributes);
        return pickBy(vote, negate(isNil));
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): Invoice => {
        const data = snapshot.data(options);
        return new Invoice(
          store,
          snapshot.id,
          data.timestamp,
          data.email,
          data.userId,
          data.items,
          data?.lastStripeEvent,
          data?.stripeInvoiceUrl,
          data?.stripeInvoiceStatus,
          data?.daysUntilDue
        );
      },
    };
  }

  static collection(firestore: AngularFirestore) {
    return firestore.firestore
      .collection('invoices')
      .withConverter(Invoice.getConverter(firestore));
  }
}

export interface InvoiceItem {
  amount: number;
  currency: string;
  description: string;
  quantity?: number;
}
