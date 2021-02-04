import { AngularFirestore } from '@angular/fire/firestore';
import { getType } from '@tumi/modules/shared';
import firebase from 'firebase/app';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export interface MemberRights {
  seeDrafts: boolean;
  manageApplications: boolean;
  manageMembers: boolean;
  manageUsers: boolean;
  accessTransactions: boolean;
  scanRequests: boolean;
}

export class User {
  private _rights: MemberRights;

  constructor(
    private store: AngularFirestore,
    readonly id: string,
    readonly provider: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public photoUrl: string,
    readonly isAdmin: boolean,
    public type: 'E' | 'D' | 'L' | 'P',
    public country: string,
    public phone: string,
    public address: string,
    public status: MemberStatus,
    private joinedAsTutorTimestamp: firebase.firestore.Timestamp,
    private birthdayTimestamp: firebase.firestore.Timestamp,
    rights: MemberRights | undefined,
    private _isTutor: boolean,
    private _joinedAssociation: firebase.firestore.Timestamp
  ) {
    this._rights = {
      seeDrafts: false,
      manageApplications: false,
      manageMembers: false,
      manageUsers: false,
      accessTransactions: false,
      scanRequests: false,
      ...rights,
    };
  }

  static get attributes(): string[] {
    return [
      'email',
      'firstName',
      'lastName',
      'type',
      'country',
      'phone',
      'address',
      'birthday',
      'status',
      'rights',
      'joinedAssociation',
    ];
  }

  get friendlyType(): string {
    return getType(this.type);
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * @deprecated
   */
  get joinedAsTutor(): Date {
    return this.joinedAsTutorTimestamp.toDate();
  }

  /**
   * @deprecated
   */
  get isOldie(): boolean {
    return !!this.joinedAsTutorTimestamp;
  }

  get birthday(): Date {
    return this.birthdayTimestamp?.toDate();
  }

  set birthday(date: Date) {
    this.birthdayTimestamp = firebase.firestore.Timestamp.fromDate(date);
  }

  /**
   * @deprecated
   */
  get isEditor() {
    return this.canSeeDrafts;
  }

  /**
   * @deprecated
   */
  get isTutor() {
    return this.isMember || this.isEditor || this._isTutor;
  }

  get canSeeDrafts(): boolean {
    return this._rights.seeDrafts || this.isAdmin;
  }

  get canManageApplications(): boolean {
    return this._rights.manageApplications || this.isAdmin;
  }

  get canManageMembers(): boolean {
    return this._rights.manageMembers || this.isAdmin;
  }

  get canManageUsers(): boolean {
    return this._rights.manageUsers || this.isAdmin;
  }

  get canAccessTransactions(): boolean {
    return this._rights.accessTransactions || this.isAdmin;
  }

  get canScanRequests(): boolean {
    return this._rights.scanRequests || this.isAdmin;
  }

  get isMember(): boolean {
    return this.status !== MemberStatus.none;
  }

  public get rights(): MemberRights {
    return this._rights;
  }

  public set rights(value: MemberRights) {
    this._rights = value;
  }

  get joinedAssociation(): Date {
    return this._joinedAssociation?.toDate();
  }

  set joinedAssociation(date: Date) {
    this._joinedAssociation = firebase.firestore.Timestamp.fromDate(date);
  }

  get visibleToUser(): string[] {
    const stati = ['public'];
    if (this.status !== MemberStatus.none || this._rights.seeDrafts) {
      stati.push('internal');
    }
    if (this._rights.seeDrafts) {
      stati.push('draft');
    }
    return stati;
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
          data.type,
          data.country,
          data.phone,
          data.address,
          data.status ?? MemberStatus.none,
          data.joinedAsTutor,
          data.birthday,
          data.rights,
          data.isTutor,
          data.joinedAssociation
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

export enum MemberStatus {
  none = 'NONE',
  trial = 'TRIAL',
  full = 'FULL',
}
