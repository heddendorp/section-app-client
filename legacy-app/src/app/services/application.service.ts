import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { Application } from '@tumi/models';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import App = firebase.app.App;

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private collection: AngularFirestoreCollection<Application>;
  constructor(private store: AngularFirestore) {
    this.collection = this.store.collection<Application>(
      Application.collection(store)
    );
  }

  public addApplication(
    application: Application
  ): Promise<DocumentReference<Application>> {
    return this.collection.add(application);
  }

  public userHasApplication(userId: string): Observable<boolean> {
    return this.store
      .collection<Application>(Application.collection(this.store), (ref) =>
        ref.where('userId', '==', userId)
      )
      .get()
      .pipe(map((snapshot) => !snapshot.empty));
  }

  public applicationsForUser(userId: string): Observable<Application[]> {
    return this.store
      .collection<Application>(Application.collection(this.store), (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges();
  }
}
