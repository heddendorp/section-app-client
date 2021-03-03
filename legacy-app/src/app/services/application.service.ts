import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import {
  NewMemberApplication,
  ApplicationVote,
  ApplicationState,
} from '@tumi/models';
import { FullMemberApplication } from '@tumi/models/fullMemberApplication';
import { application } from 'express';
import firebase from 'firebase';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import App = firebase.app.App;

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private newMembersCollection: AngularFirestoreCollection<NewMemberApplication>;
  private fullMembersCollection: AngularFirestoreCollection<FullMemberApplication>;
  constructor(private store: AngularFirestore) {
    this.newMembersCollection = this.store.collection<NewMemberApplication>(
      NewMemberApplication.collection(store)
    );
    this.fullMembersCollection = this.store.collection<FullMemberApplication>(
      FullMemberApplication.collection(store)
    );
  }

  public getAllNewMembers(
    includeVotes = true
  ): Observable<NewMemberApplication[]> {
    if (!includeVotes) {
      return this.store
        .collection<NewMemberApplication>(
          NewMemberApplication.collection(this.store),
          (ref) =>
            ref
              .where('state', '==', ApplicationState.Submitted)
              .orderBy('created', 'desc')
        )
        .valueChanges();
    }
    return this.store
      .collection<NewMemberApplication>(
        NewMemberApplication.collection(this.store),
        (ref) =>
          ref
            .where('state', '==', ApplicationState.Submitted)
            .orderBy('created', 'asc')
      )
      .valueChanges()
      .pipe(
        switchMap((applications) =>
          combineLatest(
            applications.map((application) =>
              this.votesForNewMemberApplication(application.id)
            )
          ).pipe(
            map((votes) =>
              applications.map((application, index) => {
                application.votes = votes[index];
                return application;
              })
            )
          )
        )
      );
  }

  public getAllFullMembers(
    includeVotes = true
  ): Observable<FullMemberApplication[]> {
    if (!includeVotes) {
      return this.store
        .collection<FullMemberApplication>(
          FullMemberApplication.collection(this.store),
          (ref) => ref.orderBy('created', 'desc')
        )
        .valueChanges();
    }
    return this.store
      .collection<FullMemberApplication>(
        FullMemberApplication.collection(this.store),
        (ref) => ref.orderBy('created', 'asc')
      )
      .valueChanges()
      .pipe(
        switchMap((applications) =>
          combineLatest(
            applications.map((application) =>
              this.votesForNewMemberApplication(application.id)
            )
          ).pipe(
            map((votes) =>
              applications.map((application, index) => {
                application.votes = votes[index];
                return application;
              })
            )
          )
        )
      );
  }

  public getOneNewMember(
    applicationId: string
  ): Observable<NewMemberApplication> {
    return this.newMembersCollection
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

  public addNewMember(
    application: NewMemberApplication
  ): Promise<DocumentReference<NewMemberApplication>> {
    return this.newMembersCollection.add(application);
  }

  public addFullMember(
    application: FullMemberApplication
  ): Promise<DocumentReference<FullMemberApplication>> {
    return this.fullMembersCollection.add(application);
  }

  public userHasNewMemberApplication(userId: string): Observable<boolean> {
    return this.store
      .collection<NewMemberApplication>(
        NewMemberApplication.collection(this.store),
        (ref) => ref.where('userId', '==', userId)
      )
      .get()
      .pipe(map((snapshot) => !snapshot.empty));
  }

  public userHasFullMemberApplication(userId: string): Observable<boolean> {
    return this.store
      .collection<FullMemberApplication>(
        FullMemberApplication.collection(this.store),
        (ref) => ref.where('userId', '==', userId)
      )
      .get()
      .pipe(map((snapshot) => !snapshot.empty));
  }

  public newMemberApplicationsForUser(
    userId: string
  ): Observable<NewMemberApplication[]> {
    return this.store
      .collection<NewMemberApplication>(
        NewMemberApplication.collection(this.store),
        (ref) => ref.where('userId', '==', userId)
      )
      .valueChanges();
  }

  public fullMemberApplicationsForUser(
    userId: string
  ): Observable<FullMemberApplication[]> {
    return this.store
      .collection<FullMemberApplication>(
        FullMemberApplication.collection(this.store),
        (ref) => ref.where('userId', '==', userId)
      )
      .valueChanges();
  }

  public updateNewMemberApplication(
    id: string,
    update: Partial<NewMemberApplication>
  ): Promise<void> {
    return this.newMembersCollection.doc(id).update(update);
  }

  public updateFullMemberApplication(
    id: string,
    update: Partial<FullMemberApplication>
  ): Promise<void> {
    return this.fullMembersCollection.doc(id).update(update);
  }

  public setVoteOnNewMember(
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

  public userHasVotedOnNewMember(
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

  public votesForNewMemberApplication(
    applicationId: string
  ): Observable<ApplicationVote[]> {
    return this.store
      .collection<ApplicationVote>(
        ApplicationVote.collection(this.store, applicationId)
      )
      .valueChanges();
  }
}
