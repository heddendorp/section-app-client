import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private firestore: AngularFirestore) {}

  get students(): Observable<Student[]> {
    return this.firestore
      .collection<Student>('students', ref => ref.orderBy('lastName'))
      .valueChanges({ idField: 'id' });
  }
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  country: string;
  status: string;
}
