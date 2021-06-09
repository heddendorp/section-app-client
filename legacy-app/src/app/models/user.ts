import { AngularFirestore } from '@angular/fire/firestore';
import { getType } from '@tumi/modules/shared';
import firebase from 'firebase/app';
import { isNil, negate, pick, pickBy } from 'lodash-es';
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export interface MemberRights {
  createEvents: boolean;
  publishEvents: boolean;
  manageEvents: boolean;
  seeDrafts: boolean;
  manageApplications: boolean;
  manageMembers: boolean;
  manageUsers: boolean;
  accessTransactions: boolean;
  scanRequests: boolean;
  betaFeatures: boolean;
  manageInvoices: boolean;
}

export class User {
  private _rights: MemberRights;
  private _joinedAssociation: firebase.firestore.Timestamp;
  private _joinedAsFullMember: firebase.firestore.Timestamp;

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
    public membershipFee: number,
    public onAlumniMailingList: boolean,
    private joinedAsTutorTimestamp: firebase.firestore.Timestamp,
    private birthdayTimestamp: firebase.firestore.Timestamp,
    rights: MemberRights | undefined,
    private _isTutor: boolean,
    joinedAssociation: firebase.firestore.Timestamp | string,
    joinedAsFullMember: firebase.firestore.Timestamp | string
  ) {
    this._rights = {
      seeDrafts: false,
      manageApplications: false,
      manageMembers: false,
      manageUsers: false,
      accessTransactions: false,
      scanRequests: false,
      betaFeatures: false,
      createEvents: false,
      manageEvents: false,
      publishEvents:false,
      manageInvoices: false,
      ...rights,
    };
    if (typeof joinedAssociation === 'string') {
      this.joinedAssociation = new Date(joinedAssociation);
    } else {
      this._joinedAssociation = joinedAssociation;
    }
    if (typeof joinedAsFullMember === 'string') {
      this.joinedAsFullMember = new Date(joinedAsFullMember);
    } else {
      this._joinedAsFullMember = joinedAsFullMember;
    }
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
      'membershipFee',
      'onAlumniMailingList',
      'rights',
      'joinedAssociation',
      'joinedAsFullMember',
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

  get canManageInvoices(): boolean {
    return this._rights.manageInvoices || this.isAdmin;
  }

  get canScanRequests(): boolean {
    return this._rights.scanRequests || this.isAdmin;
  }

  get canSeeBetaFeatures(): boolean {
    return this._rights.betaFeatures || this.isAdmin;
  }

  get canCreateEvents(): boolean {
    return this._rights.createEvents || this.isAdmin;
  }

  get canManageEvents(): boolean {
    return this._rights.manageEvents || this.isAdmin;
  }

  get canPublishEvents(): boolean {
    return this._rights.publishEvents || this.isAdmin;
  }

  get isMember(): boolean {
    return this.status !== MemberStatus.none;
  }

  get isTrialMember(): boolean {
    return this.status === MemberStatus.trial;
  }

  get isFullMember(): boolean {
    return this.status === MemberStatus.full;
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

  get joinedAsFullMember(): Date {
    return this._joinedAsFullMember?.toDate();
  }

  set joinedAsFullMember(date: Date) {
    this._joinedAsFullMember = firebase.firestore.Timestamp.fromDate(date);
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
          data.membershipFee ?? 5,
          data.onAlumniMailingList ?? false,
          data.joinedAsTutor,
          data.birthday,
          data.rights,
          data.isTutor,
          data.joinedAssociation,
          data.joinedAsFullMember
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
  sponsor = 'SPONSOR'
}
