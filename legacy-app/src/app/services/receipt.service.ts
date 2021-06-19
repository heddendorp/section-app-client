import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  public addReceiptToEvent(eventId: string, receipt: any) {
    console.log(eventId);
    console.log(receipt);
    this.firestore
      .collection('events')
      .doc(eventId)
      .collection('receipts')
      .add(receipt)
      .then((res) => console.log(res));
  }
}
