import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export class ApplicationVote {
  constructor(
    private store: AngularFirestore,
    readonly id: string,
    readonly rating: string,
    readonly comment: string,
    readonly author: string
  ) {}
  static get attributes(): string[] {
    return ['rating', 'comment', 'author'];
  }
  static getConverter(
    store: AngularFirestore
  ): FirestoreDataConverter<ApplicationVote> {
    return {
      toFirestore: (
        modelObject: ApplicationVote
      ): firebase.firestore.DocumentData => {
        const vote = pick(modelObject, ApplicationVote.attributes);
        return pickBy(vote, negate(isNil));
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): ApplicationVote => {
        const data = snapshot.data(options);
        return new ApplicationVote(
          store,
          snapshot.id,
          data.rating,
          data.comment,
          data.author
        );
      },
    };
  }

  static collection(firestore: AngularFirestore, applicationId: string) {
    return firestore.firestore
      .collection('applications')
      .doc(applicationId)
      .collection('votes')
      .withConverter(ApplicationVote.getConverter(firestore));
  }

  public get icon(): string {
    switch (this.rating) {
      case 'approve':
        return 'icon-approve';
      case 'disapprove':
        return 'icon-disapprove';
      default:
        return 'icon-neutral-decision';
    }
  }
}
