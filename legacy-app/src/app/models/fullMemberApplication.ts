import { AngularFirestore } from '@angular/fire/firestore';
import { ApplicationVote } from '@tumi/models/applicationVote';
import { ApplicationState } from '@tumi/models/newMemberApplication';
import firebase from 'firebase';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export class FullMemberApplication {
  public votes: ApplicationVote[] = [];
  readonly type: 'fullMember' = 'fullMember';
  constructor(
    private store: AngularFirestore,
    readonly id: string,
    readonly userId: string,
    public comment: string,
    public events: { name: string; comment: string }[],
    private _created: firebase.firestore.Timestamp,
    public state: ApplicationState
  ) {}
  static get attributes(): string[] {
    return ['comment', 'events', 'userId', 'created', 'state'];
  }
  static getConverter(
    store: AngularFirestore
  ): FirestoreDataConverter<FullMemberApplication> {
    return {
      toFirestore: (
        modelObject: FullMemberApplication
      ): firebase.firestore.DocumentData => {
        const application = pick(modelObject, FullMemberApplication.attributes);
        return pickBy(application, negate(isNil));
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): FullMemberApplication => {
        const data = snapshot.data(options);
        return new FullMemberApplication(
          store,
          snapshot.id,
          data.userId,
          data.comment,
          data.events,
          data.created,
          data.state
        );
      },
    };
  }

  static collection(firestore: AngularFirestore) {
    return firestore.firestore
      .collection('fullMemberApplications')
      .withConverter(FullMemberApplication.getConverter(firestore));
  }

  public get created(): Date {
    return this._created.toDate();
  }
}
