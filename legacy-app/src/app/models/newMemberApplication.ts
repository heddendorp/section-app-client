import { AngularFirestore } from '@angular/fire/firestore';
import { ApplicationVote } from '@tumi/models/applicationVote';
import firebase from 'firebase';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export class NewMemberApplication {
  public votes: ApplicationVote[] = [];
  readonly type: 'newMember' = 'newMember';
  constructor(
    private store: AngularFirestore,
    readonly id: string,
    readonly userId: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    private birthdayTimestamp: firebase.firestore.Timestamp,
    public country: string,
    public studyLevel: string,
    public studySemester: string,
    public studyField: string,
    private graduationTimestamp: firebase.firestore.Timestamp,
    public languages: { language: string; level: string }[],
    public experienceAbroad: string,
    public experienceVolunteering: string,
    public motivation: string,
    private createdTimestamp: firebase.firestore.Timestamp,
    public state: ApplicationState
  ) {}
  static get attributes(): string[] {
    return [
      'firstName',
      'lastName',
      'email',
      'phone',
      'birthday',
      'country',
      'studyLevel',
      'studySemester',
      'studyField',
      'graduation',
      'languages',
      'experienceAbroad',
      'experienceVolunteering',
      'motivation',
      'userId',
      'created',
      'state',
    ];
  }
  static getConverter(
    store: AngularFirestore
  ): FirestoreDataConverter<NewMemberApplication> {
    return {
      toFirestore: (
        modelObject: NewMemberApplication
      ): firebase.firestore.DocumentData => {
        const application = pick(modelObject, NewMemberApplication.attributes);
        return pickBy(application, negate(isNil));
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): NewMemberApplication => {
        const data = snapshot.data(options);
        return new NewMemberApplication(
          store,
          snapshot.id,
          data.userId,
          data.firstName,
          data.lastName,
          data.email,
          data.phone,
          data.birthday,
          data.country,
          data.studyLevel,
          data.studySemester,
          data.studyField,
          data.graduation,
          data.languages,
          data.experienceAbroad,
          data.experienceVolunteering,
          data.motivation,
          data.created,
          data.state
        );
      },
    };
  }

  static collection(firestore: AngularFirestore) {
    return firestore.firestore
      .collection('applications')
      .withConverter(NewMemberApplication.getConverter(firestore));
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public get birthday(): Date {
    return this.birthdayTimestamp.toDate();
  }
  public get graduation(): Date {
    return this.graduationTimestamp.toDate();
  }

  public get created(): Date {
    return this.createdTimestamp.toDate();
  }
}

export enum ApplicationState {
  Submitted = 'SUBMITTED',
  Rejected = 'REJECTED',
  Accepted = 'ACCEPTED',
}
