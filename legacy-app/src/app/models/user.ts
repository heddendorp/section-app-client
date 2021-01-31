import { AngularFirestore } from '@angular/fire/firestore';
import { getType } from '@tumi/modules/shared';
import firebase from 'firebase/app';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export class User {
  constructor(
    private store: AngularFirestore,
    readonly id: string,
    readonly provider: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public photoUrl: string,
    readonly isAdmin: boolean,
    public isEditor: boolean,
    public isTutor: boolean,
    public type: 'E' | 'D' | 'L' | 'P',
    public country: string,
    public phone: string,
    public address: string,
    private joinedAsTutorTimestamp: firebase.firestore.Timestamp,
    private birthdayTimestamp: firebase.firestore.Timestamp
  ) {}

  static get attributes(): string[] {
    return [
      'email',
      'firstName',
      'lastName',
      'isEditor',
      'isTutor',
      'type',
      'country',
      'phone',
      'address',
      'birthday',
    ];
  }

  get friendlyType(): string {
    return getType(this.type);
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get joinedAsTutor(): Date {
    return this.joinedAsTutorTimestamp.toDate();
  }

  get isOldie(): boolean {
    return !!this.joinedAsTutorTimestamp;
  }

  get birthday(): Date {
    return this.birthdayTimestamp.toDate();
  }

  set birthday(date: Date) {
    this.birthdayTimestamp = firebase.firestore.Timestamp.fromDate(date);
  }

  static getConverter(store: AngularFirestore): FirestoreDataConverter<User> {
    return {
      toFirestore: (modelObject: User): firebase.firestore.DocumentData => {
        const user = pick(modelObject, User.attributes);
        return pickBy(user, negate(isNil));
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): User => {
        const data = snapshot.data(options);
        // console.log(data);
        return new User(
          store,
          snapshot.id,
          data.provider,
          data.email ?? '',
          data.firstName,
          data.lastName,
          data.photoUrl,
          data.isAdmin,
          data.isEditor,
          data.isTutor,
          data.type,
          data.country,
          data.phone,
          data.address,
          data.joinedAsTutor,
          data.birthday
        );
      },
    };
  }

  static collection(firestore: AngularFirestore) {
    return firestore.firestore
      .collection('users')
      .withConverter(User.getConverter(firestore));
  }

  public removeData() {
    this.email = 'removedUser';
    this.firstName = 'removed';
    this.lastName = 'user';
    this.photoUrl = '';
    this.country = '';
    this.phone = '';
    this.address = '';
  }
}
