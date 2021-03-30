import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { User } from '@tumi/models';
import { Invoice } from '@tumi/models/invoice';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoiceCollection: AngularFirestoreCollection<Invoice>;
  constructor(private store: AngularFirestore) {
    this.invoiceCollection = this.store.collection<Invoice>(
      Invoice.collection(this.store)
    );
  }

  public getAllInvoices() {
    return this.invoiceCollection.valueChanges().pipe(shareReplay(1));
  }

  public getForUserId(userId: string) {
    console.log(userId);
    return this.store
      .collection<Invoice>(Invoice.collection(this.store), (ref) =>
        ref.where('userId', '==', userId).orderBy('timestamp', 'desc')
      )
      .valueChanges()
      .pipe(shareReplay(1));
  }

  public createInvoiceForUser({ email, id }: User) {
    return this.invoiceCollection.add({
      email,
      userId: id,
      timestamp: new Date(),
      items: [
        {
          description: 'TUMi membership fee SoSe21',
          amount: 500,
          currency: 'EUR',
        },
      ],
    } as Invoice);
  }
}
