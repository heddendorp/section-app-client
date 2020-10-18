import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  constructor(private firestore: AngularFirestore) {}

  public async addEventTransaction(
    comment: string,
    event: any,
    user: any,
    type:
      | 'registration'
      | 'onLocationPayment'
      | 'refund'
      | 'moneyCollection'
      | 'ticketSale',
    fullCost = 0
  ): Promise<void> {
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
      case 'ticketSale': {
        value = fullCost;
        break;
      }
    }
    await this.firestore
      .collection('stats')
      .doc('money')
      .collection('transactions')
      .add({
        comment,
        type,
        value,
        timestamp: new Date(),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        event: {
          id: user.id,
          name: event.name,
          price: event.price ?? null,
          fullCost: event.fullCost,
          start: event.start,
          end: event.end,
        },
      });
  }
}
