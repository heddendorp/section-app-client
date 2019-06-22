import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  constructor(private firestore: AngularFirestore) {}

  get tutors(): Observable<Tutor[]> {
    return this.firestore.collection<Tutor>('tutors', ref => ref.orderBy('lastName')).valueChanges({ idField: 'id' });
  }
}

export interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
}
