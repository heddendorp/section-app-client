import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private firestore: AngularFirestore, private fireFunctions: AngularFireFunctions) {
  }

  getEventStats() {
    return this.firestore.collection('stats').doc('events').valueChanges();
  }

  updateEventStats() {
    return this.fireFunctions.httpsCallable('updateEventStats')(null);
  }
}
