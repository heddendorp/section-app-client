import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { Application, ApplicationVote } from '@tumi/models';
import { application } from 'express';
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

  public getAll(): Observable<Application[]> {
    return this.collection.valueChanges();
  }

  public getOne(applicationId: string): Observable<Application> {
    return this.collection
      .doc(applicationId)
      .valueChanges()
      .pipe(
        map((application) => {
          if (!application) {
            throw new Error(`No application with id ${applicationId} found`);
          }
          return application;
        })
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

  public setVote(
    applicationId: string,
    voteId: string,
    vote: ApplicationVote
  ): Promise<void> {
    return this.store
      .collection<ApplicationVote>(
        ApplicationVote.collection(this.store, applicationId)
      )
      .doc(voteId)
      .set(vote);
  }

  public userHasVoted(
    applicationId: string,
    userId: string
  ): Observable<boolean> {
    return this.store
      .collection<ApplicationVote>(
        ApplicationVote.collection(this.store, applicationId)
      )
      .doc(userId)
      .get()
      .pipe(map((snap) => snap.exists));
  }

  public votesForApplication(
    applicationId: string
  ): Observable<ApplicationVote[]> {
    return this.store
      .collection<ApplicationVote>(
        ApplicationVote.collection(this.store, applicationId)
      )
      .valueChanges();
  }
}
