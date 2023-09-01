import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
  Decimal: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
};

export type CostItem = {
  __typename?: 'CostItem';
  actualAmount?: Maybe<Scalars['Decimal']['output']>;
  amount: Scalars['Decimal']['output'];
  calculationInfo: Scalars['String']['output'];
  complete: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  details?: Maybe<Scalars['String']['output']>;
  event: TumiEvent;
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notSubsidized: Scalars['Boolean']['output'];
  onInvoice: Scalars['Boolean']['output'];
  receipts: Array<Receipt>;
  submittedAmount: Scalars['Decimal']['output'];
};

export type CreateEventFromTemplateInput = {
  end: Scalars['DateTime']['input'];
  eventOrganizerId: Scalars['ID']['input'];
  excludeFromRatings?: Scalars['Boolean']['input'];
  excludeFromStatistics?: Scalars['Boolean']['input'];
  organizerLimit: Scalars['Int']['input'];
  participantLimit: Scalars['Int']['input'];
  price?: InputMaybe<Scalars['Decimal']['input']>;
  registrationLink?: InputMaybe<Scalars['String']['input']>;
  registrationMode: RegistrationMode;
  start: Scalars['DateTime']['input'];
};

export type CreateEventTemplateCategoryInput = {
  icon: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateEventTemplateInput = {
  categoryId: Scalars['ID']['input'];
  comment: Scalars['String']['input'];
  coordinates: Scalars['JSON']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Decimal']['input'];
  googlePlaceId: Scalars['String']['input'];
  googlePlaceUrl: Scalars['String']['input'];
  icon: Scalars['String']['input'];
  location: Scalars['String']['input'];
  organizerText: Scalars['String']['input'];
  participantText: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreatePhotoShareInput = {
  cols: Scalars['Int']['input'];
  container: Scalars['String']['input'];
  originalBlob: Scalars['String']['input'];
  rows: Scalars['Int']['input'];
  type: Scalars['String']['input'];
};

export type CreateReceiptInput = {
  amount: Scalars['Decimal']['input'];
  blob: Scalars['String']['input'];
  container: Scalars['String']['input'];
  costItemId: Scalars['ID']['input'];
  md5: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateSubmissionItemInput = {
  data: Scalars['JSON']['input'];
  instruction: Scalars['String']['input'];
  name: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  submissionTime: SubmissionTime;
  type: SubmissionItemType;
};

export type CreateTransactionInput = {
  amount: Scalars['Float']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  direction: TransactionDirection;
  status?: TransactionStatus;
  subject: Scalars['String']['input'];
  type: TransactionType;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  birthdate: Scalars['DateTime']['input'];
  enrolmentStatus: EnrolmentStatus;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  university: Scalars['String']['input'];
};

export enum Currency {
  Czk = 'CZK',
  Eur = 'EUR',
}

export type Dcc = {
  __typename?: 'DCC';
  card?: Maybe<DccCard>;
  status: Scalars['String']['output'];
};

export type DccCard = {
  __typename?: 'DCCCard';
  cert: Scalars['JSON']['output'];
  format: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pub_key: Scalars['String']['output'];
  rawQR: Scalars['String']['output'];
  recovery?: Maybe<Scalars['JSON']['output']>;
  scanDate: Scalars['DateTime']['output'];
  signature: Scalars['String']['output'];
  test?: Maybe<Scalars['JSON']['output']>;
  type: Scalars['String']['output'];
  vaccination?: Maybe<Scalars['JSON']['output']>;
  verified: Scalars['String']['output'];
};

export type DateRangeInput = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DeRegistrationConfig = {
  __typename?: 'DeRegistrationConfig';
  organizers: OrganizerDeRegistrationSettings;
  participants: ParticipantDeRegistrationSettings;
};

export enum EnrolmentStatus {
  Exchange = 'EXCHANGE',
  International = 'INTERNATIONAL',
  Local = 'LOCAL',
  None = 'NONE',
  Other = 'OTHER',
}

export type EventOrganizer = {
  __typename?: 'EventOrganizer';
  createdAt: Scalars['DateTime']['output'];
  events: Array<TumiEvent>;
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tenant: Tenant;
  tenantId: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type EventRegistration = {
  __typename?: 'EventRegistration';
  anonymousRating: Scalars['Boolean']['output'];
  /** The sum of all transactions related to this registration */
  balance: Scalars['Decimal']['output'];
  belongsToCurrentUser: Scalars['Boolean']['output'];
  cancellationReason?: Maybe<Scalars['String']['output']>;
  checkInTime?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creatingCode?: Maybe<EventRegistrationCode>;
  deletingCode?: Maybe<EventRegistrationCode>;
  didAttend: Scalars['Boolean']['output'];
  event: TumiEvent;
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  manualCheckin: Scalars['Boolean']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  status: RegistrationStatus;
  submissions: Array<EventSubmission>;
  transactions: Array<Transaction>;
  type: RegistrationType;
  user: User;
  userComment?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

export type EventRegistrationTransactionsArgs = {
  directions?: InputMaybe<Array<TransactionDirection>>;
};

export type EventRegistrationCode = {
  __typename?: 'EventRegistrationCode';
  connectedRegistrations: Array<EventRegistration>;
  createdAt: Scalars['DateTime']['output'];
  createdById: Scalars['ID']['output'];
  creator: User;
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  registrationCreated?: Maybe<EventRegistration>;
  registrationCreatedId?: Maybe<Scalars['ID']['output']>;
  registrationToRemove?: Maybe<EventRegistration>;
  registrationToRemoveId?: Maybe<Scalars['ID']['output']>;
  sepaAllowed: Scalars['Boolean']['output'];
  status: RegistrationStatus;
  targetEvent: TumiEvent;
  targetEventId: Scalars['ID']['output'];
};

export type EventSubmission = {
  __typename?: 'EventSubmission';
  createdAt: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  registration: EventRegistration;
  registrationId?: Maybe<Scalars['ID']['output']>;
  submissionItem: EventSubmissionItem;
  submissionItemId: Scalars['ID']['output'];
};

export type EventSubmissionItem = {
  __typename?: 'EventSubmissionItem';
  createdAt: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  event: TumiEvent;
  eventId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  instruction: Scalars['String']['output'];
  name: Scalars['String']['output'];
  ownSubmissions: Array<EventSubmission>;
  required: Scalars['Boolean']['output'];
  responses: Scalars['JSON']['output'];
  submissionTime: SubmissionTime;
  submissions: Array<EventSubmission>;
  type: Scalars['String']['output'];
};

export type EventSubmissionItemOwnSubmissionsArgs = {
  onlyOwn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventSubmissionItemResponsesArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventTemplate = {
  __typename?: 'EventTemplate';
  category?: Maybe<EventTemplateCategory>;
  comment: Scalars['String']['output'];
  coordinates?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  duration: Scalars['Decimal']['output'];
  eventInstanceCount: Scalars['Int']['output'];
  eventInstances: Array<TumiEvent>;
  finances: Scalars['JSON']['output'];
  googlePlaceId?: Maybe<Scalars['String']['output']>;
  googlePlaceUrl?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isVirtual: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  medianOrganizerCount: Scalars['Int']['output'];
  medianParticipantCount: Scalars['Int']['output'];
  onlineMeetingUrl?: Maybe<Scalars['String']['output']>;
  organizerText: Scalars['String']['output'];
  participantRating?: Maybe<Scalars['Float']['output']>;
  participantRatingCount?: Maybe<Scalars['Int']['output']>;
  participantText: Scalars['String']['output'];
  tenant: Tenant;
  title: Scalars['String']['output'];
};

export type EventTemplateCategory = {
  __typename?: 'EventTemplateCategory';
  createdAt: Scalars['DateTime']['output'];
  eventCount: Scalars['Int']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  templateCount: Scalars['Int']['output'];
  templates: Array<EventTemplate>;
  tenant: Tenant;
  tenantId: Scalars['ID']['output'];
};

export type GlobalDeRegistrationConfig = {
  __typename?: 'GlobalDeRegistrationConfig';
  free: DeRegistrationConfig;
  paid: DeRegistrationConfig;
};

export enum HomePageStrategy {
  Link = 'LINK',
  Markdown = 'MARKDOWN',
  None = 'NONE',
  Static = 'STATIC',
}

export enum LogSeverity {
  Debug = 'DEBUG',
  Error = 'ERROR',
  Info = 'INFO',
  Silly = 'SILLY',
  Warning = 'WARNING',
}

export enum MembershipStatus {
  Alumni = 'ALUMNI',
  Full = 'FULL',
  None = 'NONE',
  Selected = 'SELECTED',
  Sponsor = 'SPONSOR',
  Trial = 'TRIAL',
}

export type Mutation = {
  __typename?: 'Mutation';
  addESNCard: User;
  addOrganizerToEvent: TumiEvent;
  cancelPayment: TumiEvent;
  changeEventPublication: TumiEvent;
  checkInUser: EventRegistration;
  createEventFromTemplate: TumiEvent;
  createEventOrganizer: EventOrganizer;
  createEventTemplate: EventTemplate;
  createEventTemplateCategory: EventTemplateCategory;
  createPhotoShare: PhotoShare;
  createReceipt: Receipt;
  createRegistrationCode: EventRegistrationCode;
  createSubmissionItem: EventSubmissionItem;
  createTransaction: Transaction;
  createUser: User;
  deleteCostItem: CostItem;
  deleteEvent: TumiEvent;
  deleteEventTemplateCategory: EventTemplateCategory;
  deleteReceipt: Receipt;
  deleteRegistrationCode: EventRegistrationCode;
  deleteSubmissionItem: EventSubmissionItem;
  deleteTemplate: EventTemplate;
  deregisterFromEvent: TumiEvent;
  deregisterOrganizerFromEvent: TumiEvent;
  kickFromEvent: TumiEvent;
  rateEvent: TumiEvent;
  registerForEvent: TumiEvent;
  restorePayment: TumiEvent;
  updateCostItemsFromTemplate: TumiEvent;
  /** @deprecated Only self service is allowed. Mutation has no effect! */
  updateESNCard: User;
  updateEventCoreInfo: TumiEvent;
  updateEventGeneralInfo: TumiEvent;
  updateEventLocation: TumiEvent;
  updateEventTemplateConnection: TumiEvent;
  updateTemplate: EventTemplate;
  updateTemplateCategory: EventTemplate;
  updateTemplateFinances: EventTemplate;
  updateTemplateLocation: EventTemplate;
  updateTenant: Tenant;
  updateUser: User;
  updateUserPicture: User;
  updateUserPosition: User;
  updateUserRole: UsersOfTenants;
  updateUserStatus: UsersOfTenants;
  useRegistrationCode: EventRegistrationCode;
  verifyDCC: Dcc;
};

export type MutationAddEsnCardArgs = {
  esnCardNumber: Scalars['String']['input'];
};

export type MutationAddOrganizerToEventArgs = {
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type MutationCancelPaymentArgs = {
  registrationId: Scalars['ID']['input'];
};

export type MutationChangeEventPublicationArgs = {
  eventId: Scalars['ID']['input'];
  publicationState: PublicationState;
};

export type MutationCheckInUserArgs = {
  manualCheckin?: InputMaybe<Scalars['Boolean']['input']>;
  registrationId: Scalars['ID']['input'];
};

export type MutationCreateEventFromTemplateArgs = {
  input: CreateEventFromTemplateInput;
  templateId: Scalars['ID']['input'];
};

export type MutationCreateEventOrganizerArgs = {
  newOrganizerInput: NewOrganizerInput;
};

export type MutationCreateEventTemplateArgs = {
  input: CreateEventTemplateInput;
};

export type MutationCreateEventTemplateCategoryArgs = {
  input: CreateEventTemplateCategoryInput;
};

export type MutationCreatePhotoShareArgs = {
  eventId: Scalars['ID']['input'];
  input: CreatePhotoShareInput;
};

export type MutationCreateReceiptArgs = {
  costItemId: Scalars['ID']['input'];
  input: CreateReceiptInput;
};

export type MutationCreateRegistrationCodeArgs = {
  eventId: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  registrationId?: InputMaybe<Scalars['ID']['input']>;
  sepaAllowed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationCreateSubmissionItemArgs = {
  input: CreateSubmissionItemInput;
  target?: InputMaybe<Scalars['String']['input']>;
  targetId: Scalars['ID']['input'];
};

export type MutationCreateTransactionArgs = {
  createTransactionInput: CreateTransactionInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeleteCostItemArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteEventTemplateCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};

export type MutationDeleteReceiptArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteRegistrationCodeArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteSubmissionItemArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteTemplateArgs = {
  templateId: Scalars['ID']['input'];
};

export type MutationDeregisterFromEventArgs = {
  registrationId: Scalars['ID']['input'];
};

export type MutationDeregisterOrganizerFromEventArgs = {
  registrationId: Scalars['ID']['input'];
};

export type MutationKickFromEventArgs = {
  refundFees?: Scalars['Boolean']['input'];
  registrationId: Scalars['ID']['input'];
  withRefund?: Scalars['Boolean']['input'];
};

export type MutationRateEventArgs = {
  anonymousRating?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};

export type MutationRegisterForEventArgs = {
  eventId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['JSON']['input']>;
  registrationType?: InputMaybe<RegistrationType>;
  submissions?: InputMaybe<Scalars['JSON']['input']>;
};

export type MutationRestorePaymentArgs = {
  registrationId: Scalars['ID']['input'];
};

export type MutationUpdateCostItemsFromTemplateArgs = {
  eventId: Scalars['ID']['input'];
};

export type MutationUpdateEsnCardArgs = {
  esnCardOverride: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};

export type MutationUpdateEventCoreInfoArgs = {
  eventId: Scalars['ID']['input'];
  input: UpdateCoreEventInput;
};

export type MutationUpdateEventGeneralInfoArgs = {
  eventId: Scalars['ID']['input'];
  input: UpdateGeneralEventInput;
};

export type MutationUpdateEventLocationArgs = {
  eventId: Scalars['ID']['input'];
  input: UpdateEventLocationInput;
};

export type MutationUpdateEventTemplateConnectionArgs = {
  eventId: Scalars['ID']['input'];
  templateId: Scalars['ID']['input'];
};

export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
  templateId: Scalars['ID']['input'];
};

export type MutationUpdateTemplateCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  templateId: Scalars['ID']['input'];
};

export type MutationUpdateTemplateFinancesArgs = {
  finances: Scalars['JSON']['input'];
  templateId: Scalars['ID']['input'];
};

export type MutationUpdateTemplateLocationArgs = {
  location: UpdateTemplateLocationInput;
  templateId: Scalars['ID']['input'];
};

export type MutationUpdateTenantArgs = {
  id: Scalars['ID']['input'];
  updateTenantInput: UpdateTenantInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  userId: Scalars['ID']['input'];
};

export type MutationUpdateUserPictureArgs = {
  file: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type MutationUpdateUserPositionArgs = {
  position?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type MutationUpdateUserRoleArgs = {
  role: Role;
  userId: Scalars['ID']['input'];
};

export type MutationUpdateUserStatusArgs = {
  status: MembershipStatus;
  userId: Scalars['ID']['input'];
};

export type MutationUseRegistrationCodeArgs = {
  id: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['JSON']['input']>;
};

export type MutationVerifyDccArgs = {
  certificate: Scalars['String']['input'];
};

export type NewOrganizerInput = {
  link?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type OrganizerDeRegistrationSettings = {
  __typename?: 'OrganizerDeRegistrationSettings';
  deRegistrationPossible: Scalars['Boolean']['output'];
  minimumDaysForDeRegistration: Scalars['Int']['output'];
  refundFeesOnDeRegistration: Scalars['Boolean']['output'];
};

export type ParticipantDeRegistrationSettings = {
  __typename?: 'ParticipantDeRegistrationSettings';
  deRegistrationPossible: Scalars['Boolean']['output'];
  minimumDaysForDeRegistration: Scalars['Int']['output'];
  minimumDaysForMove: Scalars['Int']['output'];
  movePossible: Scalars['Boolean']['output'];
  refundFeesOnDeRegistration: Scalars['Boolean']['output'];
  refundFeesOnMove: Scalars['Boolean']['output'];
};

export type PhotoShare = {
  __typename?: 'PhotoShare';
  cols: Scalars['Int']['output'];
  container: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  creator: User;
  creatorId: Scalars['ID']['output'];
  event: TumiEvent;
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  original: Scalars['String']['output'];
  originalBlob: Scalars['String']['output'];
  previewBlob?: Maybe<Scalars['String']['output']>;
  rows: Scalars['Int']['output'];
  src: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export enum PublicationState {
  Approval = 'APPROVAL',
  Draft = 'DRAFT',
  Organizers = 'ORGANIZERS',
  Public = 'PUBLIC',
}

export enum PurchaseStatus {
  Cancelled = 'CANCELLED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Sent = 'SENT',
}

export type Query = {
  __typename?: 'Query';
  blobUploadKey: Scalars['String']['output'];
  commonEvents: Array<TumiEvent>;
  costItem: CostItem;
  costItems: Array<CostItem>;
  currentTenant: Tenant;
  currentUser?: Maybe<User>;
  event: TumiEvent;
  eventOrganizers: Array<EventOrganizer>;
  eventRegistrationCode: EventRegistrationCode;
  eventRegistrationCodeCount: Scalars['Int']['output'];
  eventRegistrationCodes: Array<EventRegistrationCode>;
  eventTemplate: EventTemplate;
  eventTemplateCategories: Array<EventTemplateCategory>;
  eventTemplates: Array<EventTemplate>;
  events: Array<TumiEvent>;
  photoShareKey: Scalars['String']['output'];
  photos: Array<PhotoShare>;
  profileUploadKey: Scalars['String']['output'];
  registration: EventRegistration;
  registrationCount: Scalars['Int']['output'];
  registrations: Array<EventRegistration>;
  statistics: Statistics;
  tenants: Array<Tenant>;
  transactionCount: Scalars['Int']['output'];
  transactionNetAmount: Scalars['Decimal']['output'];
  transactions: Array<Transaction>;
  user: User;
  userSearchResultNum: Scalars['Int']['output'];
  users: Array<User>;
};

export type QueryCommonEventsArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCostItemArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCostItemsArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEventRegistrationCodeArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEventRegistrationCodesArgs = {
  includePassed?: InputMaybe<Scalars['Boolean']['input']>;
  includePrivate?: InputMaybe<Scalars['Boolean']['input']>;
  includeUsed?: InputMaybe<Scalars['Boolean']['input']>;
  orderByEvent?: InputMaybe<Scalars['Boolean']['input']>;
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
  pageLength?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryEventTemplateArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEventTemplatesArgs = {
  onlyWithoutCategory?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  reverseOrder?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPhotosArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryRegistrationArgs = {
  id: Scalars['ID']['input'];
};

export type QueryRegistrationCountArgs = {
  statusList?: InputMaybe<Array<RegistrationStatus>>;
};

export type QueryRegistrationsArgs = {
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
  pageLength?: InputMaybe<Scalars['Int']['input']>;
  statusList?: InputMaybe<Array<RegistrationStatus>>;
};

export type QueryStatisticsArgs = {
  range?: InputMaybe<DateRangeInput>;
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryTransactionCountArgs = {
  directions?: InputMaybe<Array<TransactionDirection>>;
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<TransactionStatus>>;
  types?: InputMaybe<Array<TransactionType>>;
};

export type QueryTransactionNetAmountArgs = {
  range?: InputMaybe<DateRangeInput>;
};

export type QueryTransactionsArgs = {
  directions?: Array<TransactionDirection>;
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  status?: Array<TransactionStatus>;
  take?: InputMaybe<Scalars['Int']['input']>;
  types?: Array<TransactionType>;
};

export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryUserSearchResultNumArgs = {
  roleList?: InputMaybe<Array<Role>>;
  search?: InputMaybe<Scalars['String']['input']>;
  statusList?: InputMaybe<Array<MembershipStatus>>;
};

export type QueryUsersArgs = {
  emptyOnEmptySearch?: InputMaybe<Scalars['Boolean']['input']>;
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']['input']>;
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
  pageLength?: InputMaybe<Scalars['Int']['input']>;
  roleList?: InputMaybe<Array<Role>>;
  search?: InputMaybe<Scalars['String']['input']>;
  statusList?: InputMaybe<Array<MembershipStatus>>;
};

export type Receipt = {
  __typename?: 'Receipt';
  amount: Scalars['Decimal']['output'];
  blob: Scalars['String']['output'];
  container: Scalars['String']['output'];
  costItem: CostItem;
  costItemId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  md5?: Maybe<Scalars['String']['output']>;
  originalUrl: Scalars['String']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export enum RegistrationMode {
  External = 'EXTERNAL',
  Online = 'ONLINE',
  Stripe = 'STRIPE',
}

export enum RegistrationStatus {
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL',
}

export enum RegistrationType {
  Calendar = 'CALENDAR',
  Organizer = 'ORGANIZER',
  Participant = 'PARTICIPANT',
}

export type ResourceLink = {
  __typename?: 'ResourceLink';
  icon: Scalars['String']['output'];
  label: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export type Statistics = {
  __typename?: 'Statistics';
  checkinHistory: Scalars['JSON']['output'];
  checkins: Scalars['Int']['output'];
  localStatusDistribution: Scalars['JSON']['output'];
  paidEvents: Scalars['Int']['output'];
  paidRegistrations: Scalars['Int']['output'];
  registrationHistory: Scalars['JSON']['output'];
  registrations: Scalars['Int']['output'];
  totalEvents: Scalars['Int']['output'];
  userEventDistribution: Scalars['JSON']['output'];
  userHistory: Scalars['JSON']['output'];
  userStatusDistribution: Scalars['JSON']['output'];
  userUniversityDistribution: Scalars['JSON']['output'];
  usersRegistered: Scalars['Int']['output'];
  usersRegisteredEvents: Scalars['Int']['output'];
  usersRegisteredFreeEvents: Scalars['Int']['output'];
  usersRegisteredPaidEvents: Scalars['Int']['output'];
};

export type StripePayment = {
  __typename?: 'StripePayment';
  amount: Scalars['Decimal']['output'];
  /** @deprecated Use checkoutUrl instead */
  checkoutSession: Scalars['String']['output'];
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  events: Scalars['JSON']['output'];
  feeAmount?: Maybe<Scalars['Decimal']['output']>;
  id: Scalars['ID']['output'];
  netAmount?: Maybe<Scalars['Decimal']['output']>;
  netLessRefundAmount: Scalars['Decimal']['output'];
  paymentIntent?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentMethodType?: Maybe<Scalars['String']['output']>;
  refundedAmount?: Maybe<Scalars['Decimal']['output']>;
  shipping?: Maybe<Scalars['JSON']['output']>;
  status: Scalars['String']['output'];
  transactions: Array<Transaction>;
};

export enum SubmissionItemType {
  Boolean = 'BOOLEAN',
  Confirm = 'CONFIRM',
  Date = 'DATE',
  File = 'FILE',
  Longtext = 'LONGTEXT',
  Number = 'NUMBER',
  Rating = 'RATING',
  Select = 'SELECT',
  Text = 'TEXT',
}

export enum SubmissionTime {
  After = 'AFTER',
  Before = 'BEFORE',
  During = 'DURING',
  Registration = 'REGISTRATION',
}

export type Tenant = {
  __typename?: 'Tenant';
  aboutPage: Scalars['String']['output'];
  communicationEmail: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Currency;
  faqPage?: Maybe<Scalars['String']['output']>;
  homePageLink?: Maybe<Scalars['String']['output']>;
  homePageStrategy: HomePageStrategy;
  id: Scalars['ID']['output'];
  imprintPage: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organizers: Array<EventOrganizer>;
  privacyPolicyPage: Scalars['String']['output'];
  settings: TenantSettings;
  shortName: Scalars['String']['output'];
  tacPage?: Maybe<Scalars['String']['output']>;
  tutorHub: Scalars['JSON']['output'];
  tutorHubEvents: Scalars['JSON']['output'];
  users: Array<UsersOfTenants>;
};

export type TenantTutorHubEventsArgs = {
  range?: InputMaybe<DateRangeInput>;
};

export type TenantSettings = {
  __typename?: 'TenantSettings';
  brandIconUrl?: Maybe<Scalars['String']['output']>;
  deRegistrationOptions: GlobalDeRegistrationConfig;
  esnCardLink?: Maybe<Scalars['String']['output']>;
  sectionHubLinks: Array<ResourceLink>;
  showPWAInstall: Scalars['Boolean']['output'];
  socialLinks: Array<ResourceLink>;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Decimal']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  creatorId?: Maybe<Scalars['ID']['output']>;
  direction: TransactionDirection;
  eventRegistration?: Maybe<EventRegistration>;
  id: Scalars['ID']['output'];
  isMembershipFee: Scalars['Boolean']['output'];
  receipts: Array<Receipt>;
  status: TransactionStatus;
  stripePayment?: Maybe<StripePayment>;
  subject: Scalars['String']['output'];
  tenant: Tenant;
  tenantId: Scalars['ID']['output'];
  type: TransactionType;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export enum TransactionDirection {
  ExternalToTumi = 'EXTERNAL_TO_TUMI',
  ExternalToUser = 'EXTERNAL_TO_USER',
  TumiToExternal = 'TUMI_TO_EXTERNAL',
  TumiToUser = 'TUMI_TO_USER',
  UserToExternal = 'USER_TO_EXTERNAL',
  UserToTumi = 'USER_TO_TUMI',
  UserToUser = 'USER_TO_USER',
}

export enum TransactionStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
}

export enum TransactionType {
  Cash = 'CASH',
  Paypal = 'PAYPAL',
  Stripe = 'STRIPE',
  Transfer = 'TRANSFER',
}

export type TumiEvent = {
  __typename?: 'TumiEvent';
  activeRegistration?: Maybe<EventRegistration>;
  amountCollected: Scalars['Decimal']['output'];
  coordinates?: Maybe<Scalars['JSON']['output']>;
  costItems: Array<CostItem>;
  couldBeOrganizer: Scalars['Boolean']['output'];
  couldBeParticipant: Scalars['Boolean']['output'];
  /** @deprecated has become the default */
  countedParticipantRegistrations: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  creatorId: Scalars['ID']['output'];
  deRegistrationSettings: DeRegistrationConfig;
  description: Scalars['String']['output'];
  /** @deprecated Use deRegistrationSettings instead. Will always return false. */
  disableDeregistration: Scalars['Boolean']['output'];
  enablePhotoSharing: Scalars['Boolean']['output'];
  end: Scalars['DateTime']['output'];
  eventOrganizerId: Scalars['ID']['output'];
  eventRegistrationCodes: Array<EventRegistrationCode>;
  eventTemplate: EventTemplate;
  eventTemplateId: Scalars['ID']['output'];
  excludeFromRatings: Scalars['Boolean']['output'];
  excludeFromStatistics: Scalars['Boolean']['output'];
  feesPaid: Scalars['Decimal']['output'];
  /** @deprecated Use participantLimit and participantRegistrationCount instead */
  freeParticipantSpots: Scalars['String']['output'];
  googlePlaceId?: Maybe<Scalars['String']['output']>;
  googlePlaceUrl?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  internalEvent: Scalars['Boolean']['output'];
  isVirtual: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  mailTemplate: Scalars['String']['output'];
  netAmountCollected: Scalars['Decimal']['output'];
  onlineMeetingUrl?: Maybe<Scalars['String']['output']>;
  organizer: EventOrganizer;
  organizerLimit: Scalars['Int']['output'];
  organizerRating?: Maybe<Scalars['Float']['output']>;
  organizerRatingCount: Scalars['Int']['output'];
  organizerRegistrationPossible: Scalars['Boolean']['output'];
  organizerRegistrationStart: Scalars['DateTime']['output'];
  organizerRegistrations: Array<EventRegistration>;
  organizerSignup: Array<Scalars['String']['output']>;
  organizerText: Scalars['String']['output'];
  organizers: Array<User>;
  organizersRegistered: Scalars['Int']['output'];
  ownRegistrations: Array<EventRegistration>;
  participantLimit: Scalars['Int']['output'];
  participantRating?: Maybe<Scalars['Float']['output']>;
  participantRatingCount: Scalars['Int']['output'];
  participantRegistrationCount: Scalars['Int']['output'];
  participantRegistrationPossible: Scalars['JSON']['output'];
  participantRegistrations: Array<EventRegistration>;
  participantSignup: Array<Scalars['String']['output']>;
  participantText: Scalars['String']['output'];
  participantsAttended: Scalars['Int']['output'];
  photoShares: Array<PhotoShare>;
  plannedSpend: Scalars['Decimal']['output'];
  prices?: Maybe<Scalars['JSON']['output']>;
  publicationState: PublicationState;
  ratingPending: Scalars['Boolean']['output'];
  ratings: Array<EventRegistration>;
  refundFeesPaid: Scalars['Decimal']['output'];
  registrationLink?: Maybe<Scalars['String']['output']>;
  registrationMode: RegistrationMode;
  registrationStart: Scalars['DateTime']['output'];
  signupVelocity: SignupVelocities;
  start: Scalars['DateTime']['output'];
  submissionItems: Array<EventSubmissionItem>;
  submittedSpend: Scalars['Decimal']['output'];
  title: Scalars['String']['output'];
  userIsCreator: Scalars['Boolean']['output'];
  userIsOrganizer: Scalars['Boolean']['output'];
  userIsRegistered: Scalars['Boolean']['output'];
};

export type TumiEventCostItemsArgs = {
  hideOnInvoice?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TumiEventOwnRegistrationsArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TumiEventParticipantRegistrationsArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']['input']>;
  includeNoShows?: InputMaybe<Scalars['Boolean']['input']>;
  includePending?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TumiEventSubmissionItemsArgs = {
  submissionTime?: InputMaybe<SubmissionTime>;
};

export type UpdateCoreEventInput = {
  deRegistrationSettings?: InputMaybe<UpdateDeRegistrationConfigInput>;
  enablePhotoSharing?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  eventOrganizerId: Scalars['ID']['input'];
  excludeFromRatings?: InputMaybe<Scalars['Boolean']['input']>;
  excludeFromStatistics?: InputMaybe<Scalars['Boolean']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  organizerLimit?: InputMaybe<Scalars['Int']['input']>;
  organizerRegistrationStart?: InputMaybe<Scalars['DateTime']['input']>;
  organizerSignup?: InputMaybe<Array<MembershipStatus>>;
  participantLimit?: InputMaybe<Scalars['Int']['input']>;
  participantSignup?: InputMaybe<Array<MembershipStatus>>;
  prices?: InputMaybe<Scalars['JSON']['input']>;
  registrationLink?: InputMaybe<Scalars['String']['input']>;
  registrationMode?: InputMaybe<RegistrationMode>;
  registrationStart?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDeRegistrationConfigInput = {
  organizers: UpdateOrganizerDeregistrationConfigInput;
  participants: UpdateParticipantDeregistrationConfigInput;
};

export type UpdateEventLocationInput = {
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  googlePlaceId?: InputMaybe<Scalars['String']['input']>;
  googlePlaceUrl?: InputMaybe<Scalars['String']['input']>;
  isVirtual: Scalars['Boolean']['input'];
  location: Scalars['String']['input'];
  onlineMeetingUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGeneralEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  organizerText?: InputMaybe<Scalars['String']['input']>;
  participantText?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizerDeregistrationConfigInput = {
  deRegistrationPossible: Scalars['Boolean']['input'];
  minimumDaysForDeRegistration: Scalars['Int']['input'];
  refundFeesOnDeRegistration: Scalars['Boolean']['input'];
};

export type UpdateParticipantDeregistrationConfigInput = {
  deRegistrationPossible: Scalars['Boolean']['input'];
  minimumDaysForDeRegistration: Scalars['Int']['input'];
  minimumDaysForMove: Scalars['Int']['input'];
  movePossible: Scalars['Boolean']['input'];
  refundFeesOnDeRegistration: Scalars['Boolean']['input'];
  refundFeesOnMove: Scalars['Boolean']['input'];
};

export type UpdateResourceLinkInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTemplateInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Decimal']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  organizerText?: InputMaybe<Scalars['String']['input']>;
  participantText?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTemplateLocationInput = {
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  googlePlaceId?: InputMaybe<Scalars['String']['input']>;
  googlePlaceUrl?: InputMaybe<Scalars['String']['input']>;
  isVirtual: Scalars['Boolean']['input'];
  location: Scalars['String']['input'];
  onlineMeetingUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenantDeRegistrationSettingsInput = {
  free?: InputMaybe<UpdateDeRegistrationConfigInput>;
  paid?: InputMaybe<UpdateDeRegistrationConfigInput>;
};

export type UpdateTenantInput = {
  aboutPage?: InputMaybe<Scalars['String']['input']>;
  communicationEmail?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Currency>;
  faqPage?: InputMaybe<Scalars['String']['input']>;
  homePageLink?: InputMaybe<Scalars['String']['input']>;
  homePageStrategy?: InputMaybe<HomePageStrategy>;
  imprintPage?: InputMaybe<Scalars['String']['input']>;
  privacyPolicyPage?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<UpdateTenantSettingsInput>;
  tacPage?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenantSettingsInput = {
  brandIconUrl?: InputMaybe<Scalars['String']['input']>;
  deRegistrationOptions?: InputMaybe<UpdateTenantDeRegistrationSettingsInput>;
  esnCardLink?: InputMaybe<Scalars['String']['input']>;
  sectionHubLinks?: InputMaybe<Array<UpdateResourceLinkInput>>;
  showPWAInstall?: InputMaybe<Scalars['Boolean']['input']>;
  socialLinks?: InputMaybe<Array<UpdateResourceLinkInput>>;
};

export type UpdateUserInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  birthdate?: InputMaybe<Scalars['DateTime']['input']>;
  communicationEmail?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  enrolmentStatus?: InputMaybe<EnrolmentStatus>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  homeUniversity?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  studyProgram?: InputMaybe<Scalars['String']['input']>;
  university?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  authId: Scalars['String']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  birthdate?: Maybe<Scalars['DateTime']['output']>;
  calendarToken: Scalars['String']['output'];
  communicationEmail?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdEvents: Array<TumiEvent>;
  createdEventsCount: Scalars['Int']['output'];
  createdTransactions: Array<Transaction>;
  /** @deprecated Use direct properties instead */
  currentTenant?: Maybe<UsersOfTenants>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  enrolmentStatus: EnrolmentStatus;
  esnCardNumber?: Maybe<Scalars['String']['output']>;
  /** @deprecated Will always be false. Only self service is possible now */
  esnCardOverride: Scalars['Boolean']['output'];
  esnCardValidUntil?: Maybe<Scalars['DateTime']['output']>;
  eventRegistrations: Array<EventRegistration>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  /** @deprecated Use esnCardNumber and esnCardValidUntil instead */
  hasESNCard: Scalars['Boolean']['output'];
  homeUniversity?: Maybe<Scalars['String']['output']>;
  iban?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  instagram?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  organizedEvents: Array<TumiEvent>;
  organizedEventsCount: Scalars['Int']['output'];
  outstandingRating: Scalars['Boolean']['output'];
  participatedEvents: Array<TumiEvent>;
  paypal?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  picture: Scalars['String']['output'];
  position?: Maybe<Scalars['String']['output']>;
  profileComplete: Scalars['Boolean']['output'];
  role: Role;
  status: MembershipStatus;
  studyProgram?: Maybe<Scalars['String']['output']>;
  transactions: Array<Transaction>;
  university?: Maybe<Scalars['String']['output']>;
};

export type UserCurrentTenantArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UserOrganizedEventsArgs = {
  hideCancelled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserParticipatedEventsArgs = {
  hideCancelled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UsersOfTenants = {
  __typename?: 'UsersOfTenants';
  createdAt: Scalars['DateTime']['output'];
  role: Role;
  status: MembershipStatus;
  tenant: Tenant;
  tenantId: Scalars['ID']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type SignupVelocities = {
  __typename?: 'signupVelocities';
  fifty?: Maybe<Scalars['Float']['output']>;
  fiftyCount?: Maybe<Scalars['Int']['output']>;
  fiftyTime?: Maybe<Scalars['String']['output']>;
  ninety?: Maybe<Scalars['Float']['output']>;
  ninetyCount?: Maybe<Scalars['Int']['output']>;
  ninetyTime?: Maybe<Scalars['String']['output']>;
  quarter?: Maybe<Scalars['Float']['output']>;
  quarterCount?: Maybe<Scalars['Int']['output']>;
  quarterTime?: Maybe<Scalars['String']['output']>;
  threequarters?: Maybe<Scalars['Float']['output']>;
  threequartersCount?: Maybe<Scalars['Int']['output']>;
  threequartersTime?: Maybe<Scalars['String']['output']>;
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    profileComplete: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    picture: string;
    university?: string | null;
    enrolmentStatus: EnrolmentStatus;
    birthdate?: string | null;
  } | null;
};

export type GetCurrentUserInfoQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserInfoQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    outstandingRating: boolean;
  } | null;
};

export type GetTenantInfoQueryVariables = Exact<{ [key: string]: never }>;

export type GetTenantInfoQuery = {
  __typename?: 'Query';
  currentTenant: {
    __typename?: 'Tenant';
    id: string;
    name: string;
    faqPage?: string | null;
    homePageStrategy: HomePageStrategy;
    homePageLink?: string | null;
    communicationEmail: string;
    settings: {
      __typename?: 'TenantSettings';
      showPWAInstall: boolean;
      brandIconUrl?: string | null;
      socialLinks: Array<{
        __typename?: 'ResourceLink';
        icon: string;
        url: string;
        label: string;
      }>;
      sectionHubLinks: Array<{
        __typename?: 'ResourceLink';
        label: string;
        icon: string;
        url: string;
      }>;
    };
  };
};

export type GetTenantCurrencyCodeQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetTenantCurrencyCodeQuery = {
  __typename?: 'Query';
  currentTenant: { __typename?: 'Tenant'; id: string; currency: Currency };
};

export type CreateEventTemplateMutationVariables = Exact<{
  input: CreateEventTemplateInput;
}>;

export type CreateEventTemplateMutation = {
  __typename?: 'Mutation';
  createEventTemplate: {
    __typename?: 'EventTemplate';
    id: string;
    createdAt: string;
  };
};

export type CreateEventFromTemplateMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
  eventData: CreateEventFromTemplateInput;
}>;

export type CreateEventFromTemplateMutation = {
  __typename?: 'Mutation';
  createEventFromTemplate: { __typename?: 'TumiEvent'; id: string };
};

export type UpdateTemplateLocationMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
  update: UpdateTemplateLocationInput;
}>;

export type UpdateTemplateLocationMutation = {
  __typename?: 'Mutation';
  updateTemplateLocation: {
    __typename?: 'EventTemplate';
    id: string;
    location: string;
    coordinates?: any | null;
    googlePlaceUrl?: string | null;
    isVirtual: boolean;
    onlineMeetingUrl?: string | null;
  };
};

export type UpdateEventTemplateCategoryAssignmentMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
  categoryId: Scalars['ID']['input'];
}>;

export type UpdateEventTemplateCategoryAssignmentMutation = {
  __typename?: 'Mutation';
  updateTemplateCategory: {
    __typename?: 'EventTemplate';
    id: string;
    category?: {
      __typename?: 'EventTemplateCategory';
      id: string;
      name: string;
    } | null;
  };
};

export type UpdateEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
  update: UpdateTemplateInput;
}>;

export type UpdateEventTemplateMutation = {
  __typename?: 'Mutation';
  updateTemplate: {
    __typename?: 'EventTemplate';
    id: string;
    title: string;
    icon: string;
    duration: any;
    description: string;
    organizerText: string;
    participantText: string;
    comment: string;
    location: string;
    coordinates?: any | null;
  };
};

export type DeleteEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
}>;

export type DeleteEventTemplateMutation = {
  __typename?: 'Mutation';
  deleteTemplate: { __typename?: 'EventTemplate'; id: string };
};

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteTemplateMutation = {
  __typename?: 'Mutation';
  deleteTemplate: { __typename?: 'EventTemplate'; id: string };
};

export type GetEventTemplatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetEventTemplatesQuery = {
  __typename?: 'Query';
  eventTemplates: Array<{
    __typename?: 'EventTemplate';
    id: string;
    title: string;
    icon: string;
  }>;
};

export type GetTemplateCategoriesWithTemplatesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetTemplateCategoriesWithTemplatesQuery = {
  __typename?: 'Query';
  eventTemplateCategories: Array<{
    __typename?: 'EventTemplateCategory';
    id: string;
    name: string;
    icon: string;
    eventCount: number;
    templateCount: number;
    templates: Array<{
      __typename?: 'EventTemplate';
      id: string;
      title: string;
      icon: string;
      participantRating?: number | null;
      participantRatingCount?: number | null;
      eventInstanceCount: number;
    }>;
  }>;
};

export type GetEventTemplateCategoriesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetEventTemplateCategoriesQuery = {
  __typename?: 'Query';
  eventTemplateCategories: Array<{
    __typename?: 'EventTemplateCategory';
    id: string;
    name: string;
    icon: string;
  }>;
};

export type GetLonelyEventTemplatesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetLonelyEventTemplatesQuery = {
  __typename?: 'Query';
  eventTemplates: Array<{
    __typename?: 'EventTemplate';
    id: string;
    title: string;
    icon: string;
    participantRating?: number | null;
    participantRatingCount?: number | null;
  }>;
};

export type GetEventTemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetEventTemplateQuery = {
  __typename?: 'Query';
  eventTemplate: {
    __typename?: 'EventTemplate';
    id: string;
    title: string;
    icon: string;
    duration: any;
    description: string;
    organizerText: string;
    participantText: string;
    comment: string;
    location: string;
    coordinates?: any | null;
    googlePlaceUrl?: string | null;
    isVirtual: boolean;
    onlineMeetingUrl?: string | null;
    finances: any;
    medianParticipantCount: number;
    medianOrganizerCount: number;
    category?: {
      __typename?: 'EventTemplateCategory';
      id: string;
      name: string;
      icon: string;
    } | null;
    eventInstances: Array<{
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      start: string;
      participantRating?: number | null;
      participantRatingCount: number;
      organizerRating?: number | null;
      organizerRatingCount: number;
      signupVelocity: {
        __typename?: 'signupVelocities';
        quarter?: number | null;
        quarterTime?: string | null;
        quarterCount?: number | null;
        fifty?: number | null;
        fiftyTime?: string | null;
        fiftyCount?: number | null;
        threequarters?: number | null;
        threequartersTime?: string | null;
        threequartersCount?: number | null;
      };
      ratings: Array<{
        __typename?: 'EventRegistration';
        userComment?: string | null;
        rating?: number | null;
        type: RegistrationType;
        anonymousRating: boolean;
        user: {
          __typename?: 'User';
          id: string;
          fullName: string;
          picture: string;
          currentTenant?: {
            __typename?: 'UsersOfTenants';
            userId: string;
            tenantId: string;
            status: MembershipStatus;
          } | null;
        };
      }>;
      organizer: { __typename?: 'EventOrganizer'; id: string; name: string };
    }>;
  };
};

export type UpdateFinancesMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  finances: Scalars['JSON']['input'];
}>;

export type UpdateFinancesMutation = {
  __typename?: 'Mutation';
  updateTemplateFinances: {
    __typename?: 'EventTemplate';
    id: string;
    finances: any;
  };
};

export type GetOrganizerOptionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetOrganizerOptionsQuery = {
  __typename?: 'Query';
  eventOrganizers: Array<{
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
  }>;
};

export type GetCostItemsForEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;

export type GetCostItemsForEventQuery = {
  __typename?: 'Query';
  costItems: Array<{
    __typename?: 'CostItem';
    id: string;
    name: string;
    calculationInfo: string;
    amount: any;
    notSubsidized: boolean;
    onInvoice: boolean;
    submittedAmount: any;
  }>;
  event: {
    __typename?: 'TumiEvent';
    id: string;
    eventTemplate: { __typename?: 'EventTemplate'; id: string; finances: any };
  };
};

export type UpdateCostItemsFromTemplateMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;

export type UpdateCostItemsFromTemplateMutation = {
  __typename?: 'Mutation';
  updateCostItemsFromTemplate: {
    __typename?: 'TumiEvent';
    id: string;
    costItems: Array<{
      __typename?: 'CostItem';
      id: string;
      name: string;
      calculationInfo: string;
      amount: any;
      notSubsidized: boolean;
      onInvoice: boolean;
    }>;
  };
};

export type RegisterForEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  type?: InputMaybe<RegistrationType>;
  submissions?: InputMaybe<Scalars['JSON']['input']>;
  price?: InputMaybe<Scalars['JSON']['input']>;
}>;

export type RegisterForEventMutation = {
  __typename?: 'Mutation';
  registerForEvent: {
    __typename?: 'TumiEvent';
    id: string;
    organizerRegistrationPossible: boolean;
    participantRegistrationPossible: any;
    organizersRegistered: number;
    participantRegistrationCount: number;
    couldBeOrganizer: boolean;
    userIsRegistered: boolean;
    activeRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
      type: RegistrationType;
      status: RegistrationStatus;
      cancellationReason?: string | null;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          createdAt: string;
          amount: any;
          status: string;
          checkoutUrl?: string | null;
          paymentIntent?: string | null;
        } | null;
      }>;
    } | null;
    organizers: Array<{ __typename?: 'User'; fullName: string }>;
  };
};

export type DeregisterFromEventMutationVariables = Exact<{
  registrationId: Scalars['ID']['input'];
}>;

export type DeregisterFromEventMutation = {
  __typename?: 'Mutation';
  deregisterFromEvent: {
    __typename?: 'TumiEvent';
    id: string;
    participantRegistrationPossible: any;
    participantRegistrationCount: number;
    userIsRegistered: boolean;
    participantRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      status: RegistrationStatus;
    }>;
    activeRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
    } | null;
    organizers: Array<{
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
    }>;
  };
};

export type CancelPaymentMutationVariables = Exact<{
  registrationId: Scalars['ID']['input'];
}>;

export type CancelPaymentMutation = {
  __typename?: 'Mutation';
  cancelPayment: {
    __typename?: 'TumiEvent';
    id: string;
    userIsRegistered: boolean;
    participantRegistrationPossible: any;
    activeRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
      type: RegistrationType;
      status: RegistrationStatus;
      cancellationReason?: string | null;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          createdAt: string;
          amount: any;
          status: string;
          checkoutSession: string;
          paymentIntent?: string | null;
        } | null;
      }>;
    } | null;
  };
};

export type LoadRegistrationForMoveQueryVariables = Exact<{
  registrationId: Scalars['ID']['input'];
}>;

export type LoadRegistrationForMoveQuery = {
  __typename?: 'Query';
  registration: {
    __typename?: 'EventRegistration';
    id: string;
    eventId: string;
    deletingCode?: {
      __typename?: 'EventRegistrationCode';
      id: string;
      isPublic: boolean;
    } | null;
  };
};

export type VerifyCertificateMutationVariables = Exact<{
  cert: Scalars['String']['input'];
}>;

export type VerifyCertificateMutation = {
  __typename?: 'Mutation';
  verifyDCC: {
    __typename?: 'DCC';
    status: string;
    card?: {
      __typename?: 'DCCCard';
      name: string;
      test?: any | null;
      vaccination?: any | null;
      recovery?: any | null;
    } | null;
  };
};

export type CreateEventRegistrationCodeMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  registrationId?: InputMaybe<Scalars['ID']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  sepaAllowed?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type CreateEventRegistrationCodeMutation = {
  __typename?: 'Mutation';
  createRegistrationCode: { __typename?: 'EventRegistrationCode'; id: string };
};

export type LoadEventForRunningQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type LoadEventForRunningQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
    end: string;
    participantLimit: number;
    participantRegistrationCount: number;
    participantsAttended: number;
    mailTemplate: string;
    createdBy: { __typename?: 'User'; id: string; fullName: string };
    organizerRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      checkInTime?: string | null;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        phone?: string | null;
        picture: string;
        email: string;
        communicationEmail?: string | null;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
    costItems: Array<{
      __typename?: 'CostItem';
      id: string;
      amount: any;
      actualAmount?: any | null;
      submittedAmount: any;
      name: string;
      receipts: Array<{ __typename?: 'Receipt'; id: string }>;
    }>;
    submissionItems: Array<{
      __typename?: 'EventSubmissionItem';
      id: string;
      name: string;
    }>;
    participantRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      checkInTime?: string | null;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
        } | null;
      }>;
      submissions: Array<{
        __typename?: 'EventSubmission';
        id: string;
        data: any;
        submissionItem: {
          __typename?: 'EventSubmissionItem';
          id: string;
          name: string;
        };
      }>;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        phone?: string | null;
        picture: string;
        email: string;
        esnCardValidUntil?: string | null;
        esnCardNumber?: string | null;
        communicationEmail?: string | null;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
  };
};

export type GetCostItemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetCostItemQuery = {
  __typename?: 'Query';
  costItem: {
    __typename?: 'CostItem';
    id: string;
    name: string;
    amount: any;
    submittedAmount: any;
    event: { __typename?: 'TumiEvent'; id: string; title: string };
    receipts: Array<{
      __typename?: 'Receipt';
      id: string;
      createdAt: string;
      amount: any;
      url: string;
      type?: string | null;
      originalUrl: string;
      user: { __typename?: 'User'; id: string; fullName: string };
    }>;
  };
};

export type GetBlobTokenQueryVariables = Exact<{ [key: string]: never }>;

export type GetBlobTokenQuery = { __typename?: 'Query'; blobUploadKey: string };

export type AddReceiptMutationVariables = Exact<{
  costItemId: Scalars['ID']['input'];
  receiptInput: CreateReceiptInput;
}>;

export type AddReceiptMutation = {
  __typename?: 'Mutation';
  createReceipt: {
    __typename?: 'Receipt';
    id: string;
    amount: any;
    url: string;
    costItem: {
      __typename?: 'CostItem';
      id: string;
      receipts: Array<{ __typename?: 'Receipt'; id: string }>;
    };
  };
};

export type DeleteReceiptMutationVariables = Exact<{
  receiptId: Scalars['ID']['input'];
}>;

export type DeleteReceiptMutation = {
  __typename?: 'Mutation';
  deleteReceipt: {
    __typename?: 'Receipt';
    id: string;
    costItem: {
      __typename?: 'CostItem';
      id: string;
      receipts: Array<{ __typename?: 'Receipt'; id: string }>;
    };
  };
};

export type GetRegistrationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetRegistrationQuery = {
  __typename?: 'Query';
  registration: {
    __typename?: 'EventRegistration';
    id: string;
    type: RegistrationType;
    didAttend: boolean;
    checkInTime?: string | null;
    transactions: Array<{
      __typename?: 'Transaction';
      id: string;
      status: TransactionStatus;
      direction: TransactionDirection;
      amount: any;
      type: TransactionType;
      subject: string;
      stripePayment?: {
        __typename?: 'StripePayment';
        id: string;
        status: string;
      } | null;
    }>;
    event: {
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
    };
    user: {
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
      esnCardNumber?: string | null;
      esnCardValidUntil?: string | null;
    };
  };
};

export type CheckInUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  manual?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type CheckInUserMutation = {
  __typename?: 'Mutation';
  checkInUser: {
    __typename?: 'EventRegistration';
    id: string;
    checkInTime?: string | null;
    didAttend: boolean;
  };
};

export type GetUserPaymentStatusQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetUserPaymentStatusQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
    } | null;
  } | null;
};

export type KickFromEventMutationVariables = Exact<{
  registrationId: Scalars['ID']['input'];
  withRefund: Scalars['Boolean']['input'];
  refundFees: Scalars['Boolean']['input'];
}>;

export type KickFromEventMutation = {
  __typename?: 'Mutation';
  kickFromEvent: {
    __typename?: 'TumiEvent';
    id: string;
    participantRegistrationCount: number;
    userIsRegistered: boolean;
    participantRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      status: RegistrationStatus;
    }>;
    activeRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
    } | null;
    organizers: Array<{
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
    }>;
  };
};

export type LoadUsersByStatusQueryVariables = Exact<{
  allowList: Array<MembershipStatus> | MembershipStatus;
}>;

export type LoadUsersByStatusQuery = {
  __typename?: 'Query';
  users: Array<{ __typename?: 'User'; id: string; fullName: string }>;
};

export type EventListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
}>;

export type EventListQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
    end: string;
    registrationStart: string;
    organizerRegistrationStart: string;
    prices?: any | null;
    organizerLimit: number;
    organizersRegistered: number;
    participantRegistrationCount: number;
    participantLimit: number;
    couldBeOrganizer: boolean;
    publicationState: PublicationState;
    registrationMode: RegistrationMode;
    userIsRegistered: boolean;
    userIsOrganizer: boolean;
    internalEvent: boolean;
  }>;
};

export type LoadEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type LoadEventQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
    end: string;
    registrationStart: string;
    organizerRegistrationStart: string;
    enablePhotoSharing: boolean;
    publicationState: PublicationState;
    description: string;
    organizerText: string;
    organizerLimit: number;
    participantText: string;
    registrationMode: RegistrationMode;
    registrationLink?: string | null;
    freeParticipantSpots: string;
    excludeFromRatings: boolean;
    ratingPending: boolean;
    prices?: any | null;
    location: string;
    coordinates?: any | null;
    googlePlaceUrl?: string | null;
    isVirtual: boolean;
    onlineMeetingUrl?: string | null;
    organizerSignup: Array<string>;
    participantSignup: Array<string>;
    organizerRegistrationPossible: boolean;
    participantRegistrationPossible: any;
    userIsRegistered: boolean;
    userIsOrganizer: boolean;
    userIsCreator: boolean;
    participantLimit: number;
    participantRegistrationCount: number;
    couldBeOrganizer: boolean;
    couldBeParticipant: boolean;
    participantRating?: number | null;
    participantRatingCount: number;
    deRegistrationSettings: {
      __typename?: 'DeRegistrationConfig';
      organizers: {
        __typename?: 'OrganizerDeRegistrationSettings';
        deRegistrationPossible: boolean;
        minimumDaysForDeRegistration: number;
      };
      participants: {
        __typename?: 'ParticipantDeRegistrationSettings';
        deRegistrationPossible: boolean;
        minimumDaysForDeRegistration: number;
        refundFeesOnDeRegistration: boolean;
        movePossible: boolean;
        minimumDaysForMove: number;
        refundFeesOnMove: boolean;
      };
    };
    createdBy: {
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
      currentTenant?: {
        __typename?: 'UsersOfTenants';
        userId: string;
        tenantId: string;
        status: MembershipStatus;
      } | null;
    };
    submissionItems: Array<{
      __typename?: 'EventSubmissionItem';
      id: string;
      name: string;
      submissionTime: SubmissionTime;
      instruction: string;
      required: boolean;
      type: string;
      data?: any | null;
      ownSubmissions: Array<{
        __typename?: 'EventSubmission';
        id: string;
        data: any;
      }>;
    }>;
    organizer: {
      __typename?: 'EventOrganizer';
      id: string;
      link?: string | null;
      text: string;
    };
    activeRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
      didAttend: boolean;
      status: RegistrationStatus;
      userComment?: string | null;
      rating?: number | null;
      anonymousRating: boolean;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          createdAt: string;
          amount: any;
          status: string;
          paymentIntent?: string | null;
          checkoutUrl?: string | null;
        } | null;
      }>;
      user: { __typename?: 'User'; id: string; fullName: string };
    } | null;
    ratings: Array<{
      __typename?: 'EventRegistration';
      userComment?: string | null;
      rating?: number | null;
      type: RegistrationType;
      anonymousRating: boolean;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
    organizers: Array<{
      __typename?: 'User';
      id: string;
      fullName: string;
      phone?: string | null;
      picture: string;
      currentTenant?: {
        __typename?: 'UsersOfTenants';
        userId: string;
        tenantId: string;
        status: MembershipStatus;
      } | null;
    }>;
  };
};

export type DeRegisterOrganizerFromEventMutationVariables = Exact<{
  registrationId: Scalars['ID']['input'];
}>;

export type DeRegisterOrganizerFromEventMutation = {
  __typename?: 'Mutation';
  deregisterOrganizerFromEvent: {
    __typename?: 'TumiEvent';
    id: string;
    organizerRegistrationPossible: boolean;
    organizersRegistered: number;
    userIsOrganizer: boolean;
    organizerRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      status: RegistrationStatus;
    }>;
    activeRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
    } | null;
    organizers: Array<{
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
    }>;
  };
};

export type LoadUserForEventQueryVariables = Exact<{ [key: string]: never }>;

export type LoadUserForEventQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    esnCardValidUntil?: string | null;
    university?: string | null;
  } | null;
};

export type LoadEventForEditQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type LoadEventForEditQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'TumiEvent';
    coordinates?: any | null;
    couldBeOrganizer: boolean;
    couldBeParticipant: boolean;
    description: string;
    end: string;
    eventOrganizerId: string;
    excludeFromRatings: boolean;
    excludeFromStatistics: boolean;
    enablePhotoSharing: boolean;
    icon: string;
    id: string;
    location: string;
    googlePlaceId?: string | null;
    googlePlaceUrl?: string | null;
    isVirtual: boolean;
    onlineMeetingUrl?: string | null;
    organizerLimit: number;
    organizerRegistrationPossible: boolean;
    organizerSignup: Array<string>;
    organizerText: string;
    organizerRegistrationStart: string;
    participantLimit: number;
    participantSignup: Array<string>;
    participantText: string;
    prices?: any | null;
    publicationState: PublicationState;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    registrationStart: string;
    start: string;
    title: string;
    createdBy: { __typename?: 'User'; id: string };
    deRegistrationSettings: {
      __typename?: 'DeRegistrationConfig';
      organizers: {
        __typename?: 'OrganizerDeRegistrationSettings';
        deRegistrationPossible: boolean;
        minimumDaysForDeRegistration: number;
      };
      participants: {
        __typename?: 'ParticipantDeRegistrationSettings';
        deRegistrationPossible: boolean;
        minimumDaysForDeRegistration: number;
        refundFeesOnDeRegistration: boolean;
        movePossible: boolean;
        minimumDaysForMove: number;
        refundFeesOnMove: boolean;
      };
    };
    eventTemplate: { __typename?: 'EventTemplate'; id: string; title: string };
    submissionItems: Array<{
      __typename?: 'EventSubmissionItem';
      id: string;
      createdAt: string;
      required: boolean;
      submissionTime: SubmissionTime;
      type: string;
      instruction: string;
      name: string;
      data?: any | null;
    }>;
    organizerRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      user: {
        __typename?: 'User';
        id: string;
        picture: string;
        fullName: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
    organizers: Array<{
      __typename?: 'User';
      fullName: string;
      picture: string;
      id: string;
    }>;
  };
  currentUser?: {
    __typename?: 'User';
    id: string;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
      role: Role;
      status: MembershipStatus;
    } | null;
  } | null;
  eventOrganizers: Array<{
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
  }>;
};

export type UpdateEventTemplateConnectionMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  templateId: Scalars['ID']['input'];
}>;

export type UpdateEventTemplateConnectionMutation = {
  __typename?: 'Mutation';
  updateEventTemplateConnection: {
    __typename?: 'TumiEvent';
    id: string;
    eventTemplate: { __typename?: 'EventTemplate'; id: string; title: string };
  };
};

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteEventMutation = {
  __typename?: 'Mutation';
  deleteEvent: { __typename?: 'TumiEvent'; id: string };
};

export type AddOrganizerToEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;

export type AddOrganizerToEventMutation = {
  __typename?: 'Mutation';
  addOrganizerToEvent: {
    __typename?: 'TumiEvent';
    id: string;
    organizers: Array<{
      __typename?: 'User';
      fullName: string;
      picture: string;
      id: string;
    }>;
  };
};

export type UpdateGeneralEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: UpdateGeneralEventInput;
}>;

export type UpdateGeneralEventMutation = {
  __typename?: 'Mutation';
  updateEventGeneralInfo: {
    __typename?: 'TumiEvent';
    id: string;
    description: string;
    organizerText: string;
    participantText: string;
  };
};

export type UpdateCoreEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: UpdateCoreEventInput;
}>;

export type UpdateCoreEventMutation = {
  __typename?: 'Mutation';
  updateEventCoreInfo: {
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
    end: string;
    registrationStart: string;
    prices?: any | null;
    registrationMode: RegistrationMode;
    registrationLink?: string | null;
    eventOrganizerId: string;
    organizerSignup: Array<string>;
    participantSignup: Array<string>;
    participantLimit: number;
    organizerLimit: number;
    excludeFromRatings: boolean;
    excludeFromStatistics: boolean;
    enablePhotoSharing: boolean;
  };
};

export type UpdatePublicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  state: PublicationState;
}>;

export type UpdatePublicationMutation = {
  __typename?: 'Mutation';
  changeEventPublication: {
    __typename?: 'TumiEvent';
    id: string;
    publicationState: PublicationState;
  };
};

export type UpdateEventLocationMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  update: UpdateEventLocationInput;
}>;

export type UpdateEventLocationMutation = {
  __typename?: 'Mutation';
  updateEventLocation: {
    __typename?: 'TumiEvent';
    id: string;
    location: string;
    coordinates?: any | null;
    isVirtual: boolean;
    onlineMeetingUrl?: string | null;
  };
};

export type AddSubmissionToEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  submissionItem: CreateSubmissionItemInput;
}>;

export type AddSubmissionToEventMutation = {
  __typename?: 'Mutation';
  createSubmissionItem: {
    __typename?: 'EventSubmissionItem';
    id: string;
    createdAt: string;
    required: boolean;
    submissionTime: SubmissionTime;
    type: string;
    instruction: string;
    name: string;
    event: {
      __typename?: 'TumiEvent';
      id: string;
      submissionItems: Array<{
        __typename?: 'EventSubmissionItem';
        id: string;
      }>;
    };
  };
};

export type RemoveSubmissionFromEventMutationVariables = Exact<{
  submissionItemId: Scalars['ID']['input'];
}>;

export type RemoveSubmissionFromEventMutation = {
  __typename?: 'Mutation';
  deleteSubmissionItem: {
    __typename?: 'EventSubmissionItem';
    id: string;
    event: {
      __typename?: 'TumiEvent';
      id: string;
      submissionItems: Array<{
        __typename?: 'EventSubmissionItem';
        id: string;
      }>;
    };
  };
};

export type LoadEventForManagementQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type LoadEventForManagementQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
    amountCollected: any;
    netAmountCollected: any;
    feesPaid: any;
    refundFeesPaid: any;
    plannedSpend: any;
    submittedSpend: any;
    participantLimit: number;
    participantRegistrationCount: number;
    participantsAttended: number;
    registrationMode: RegistrationMode;
    costItems: Array<{
      __typename?: 'CostItem';
      id: string;
      name: string;
      submittedAmount: any;
      amount: any;
    }>;
    eventTemplate: { __typename?: 'EventTemplate'; id: string; title: string };
    eventRegistrationCodes: Array<{
      __typename?: 'EventRegistrationCode';
      id: string;
      createdAt: string;
      isPublic: boolean;
      status: RegistrationStatus;
      registrationToRemoveId?: string | null;
      registrationCreatedId?: string | null;
    }>;
    organizerRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      status: RegistrationStatus;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        email: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
    participantRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      status: RegistrationStatus;
      cancellationReason?: string | null;
      balance: any;
      checkInTime?: string | null;
      didAttend: boolean;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
      }>;
      submissions: Array<{
        __typename?: 'EventSubmission';
        id: string;
        data: any;
        submissionItem: {
          __typename?: 'EventSubmissionItem';
          id: string;
          name: string;
        };
      }>;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        firstName: string;
        picture: string;
        email: string;
        phone?: string | null;
        university?: string | null;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
  };
};

export type RestorePaymentMutationVariables = Exact<{
  registrationId: Scalars['ID']['input'];
}>;

export type RestorePaymentMutation = {
  __typename?: 'Mutation';
  restorePayment: {
    __typename?: 'TumiEvent';
    id: string;
    participantRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
      }>;
    }>;
  };
};

export type DeleteRegistrationCodeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteRegistrationCodeMutation = {
  __typename?: 'Mutation';
  deleteRegistrationCode: { __typename?: 'EventRegistrationCode'; id: string };
};

export type GetPhotosOfEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;

export type GetPhotosOfEventQuery = {
  __typename?: 'Query';
  photos: Array<{
    __typename?: 'PhotoShare';
    id: string;
    cols: number;
    rows: number;
    src: string;
    original: string;
    originalBlob: string;
    type: string;
    creator: { __typename?: 'User'; id: string; fullName: string };
    event: { __typename?: 'TumiEvent'; id: string; title: string };
  }>;
  event: { __typename?: 'TumiEvent'; id: string; title: string };
};

export type GetPhotoShareKeyQueryVariables = Exact<{ [key: string]: never }>;

export type GetPhotoShareKeyQuery = {
  __typename?: 'Query';
  photoShareKey: string;
};

export type CreatePhotoShareMutationVariables = Exact<{
  data: CreatePhotoShareInput;
  eventId: Scalars['ID']['input'];
}>;

export type CreatePhotoShareMutation = {
  __typename?: 'Mutation';
  createPhotoShare: { __typename?: 'PhotoShare'; id: string };
};

export type LoadPublicRegistrationCodesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type LoadPublicRegistrationCodesQuery = {
  __typename?: 'Query';
  eventRegistrationCodes: Array<{
    __typename?: 'EventRegistrationCode';
    id: string;
    targetEvent: {
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
      start: string;
    };
  }>;
};

export type GetHomePageDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomePageDataQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
  }>;
  currentUser?: { __typename?: 'User'; id: string } | null;
};

export type GetHomePageTenantInfoQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetHomePageTenantInfoQuery = {
  __typename?: 'Query';
  currentTenant: { __typename?: 'Tenant'; id: string; shortName: string };
};

export type LoadPagesQueryVariables = Exact<{ [key: string]: never }>;

export type LoadPagesQuery = {
  __typename?: 'Query';
  currentTenant: {
    __typename?: 'Tenant';
    id: string;
    name: string;
    imprintPage: string;
    privacyPolicyPage: string;
    faqPage?: string | null;
    aboutPage: string;
    tacPage?: string | null;
  };
};

export type RegisterUserMutationVariables = Exact<{
  userInput: CreateUserInput;
}>;

export type RegisterUserMutation = {
  __typename?: 'Mutation';
  createUser: { __typename?: 'User'; id: string };
};

export type AddEsnCardMutationVariables = Exact<{
  esnCardNumber: Scalars['String']['input'];
}>;

export type AddEsnCardMutation = {
  __typename?: 'Mutation';
  addESNCard: {
    __typename?: 'User';
    id: string;
    esnCardNumber?: string | null;
    esnCardValidUntil?: string | null;
  };
};

export type GetProfileUploadKeyQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfileUploadKeyQuery = {
  __typename?: 'Query';
  profileUploadKey: string;
};

export type UpdateUserPictureMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  file: Scalars['String']['input'];
}>;

export type UpdateUserPictureMutation = {
  __typename?: 'Mutation';
  updateUserPicture: { __typename?: 'User'; id: string; picture: string };
};

export type GetPhotoJourneyQueryVariables = Exact<{ [key: string]: never }>;

export type GetPhotoJourneyQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    eventRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      status: RegistrationStatus;
      event: {
        __typename?: 'TumiEvent';
        id: string;
        title: string;
        icon: string;
        location: string;
        start: string;
        photoShares: Array<{
          __typename?: 'PhotoShare';
          id: string;
          type: string;
          src: string;
          original: string;
          originalBlob: string;
          container: string;
          cols: number;
          rows: number;
        }>;
      };
    }>;
  } | null;
};

export type UserProfileQueryVariables = Exact<{ [key: string]: never }>;

export type UserProfileQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    fullName: string;
    picture: string;
    emailVerified: boolean;
    email: string;
    communicationEmail?: string | null;
    phone?: string | null;
    university?: string | null;
    iban?: string | null;
    paypal?: string | null;
    birthdate?: string | null;
    firstName: string;
    lastName: string;
    calendarToken: string;
    esnCardNumber?: string | null;
    esnCardValidUntil?: string | null;
    enrolmentStatus: EnrolmentStatus;
    bio?: string | null;
    country?: string | null;
    homeUniversity?: string | null;
    instagram?: string | null;
    position?: string | null;
    studyProgram?: string | null;
    organizedEventsCount: number;
    createdEventsCount: number;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
      status: MembershipStatus;
    } | null;
  } | null;
  currentTenant: {
    __typename?: 'Tenant';
    settings: { __typename?: 'TenantSettings'; esnCardLink?: string | null };
  };
};

export type UserProfileEventsQueryVariables = Exact<{ [key: string]: never }>;

export type UserProfileEventsQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    createdEvents: Array<{
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
      start: string;
      end: string;
      ratingPending: boolean;
      participantRating?: number | null;
      participantRatingCount: number;
    }>;
    organizedEvents: Array<{
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
      start: string;
      end: string;
      ratingPending: boolean;
      userIsOrganizer: boolean;
      participantRating?: number | null;
      participantRatingCount: number;
    }>;
    participatedEvents: Array<{
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
      start: string;
      end: string;
      ratingPending: boolean;
      userIsOrganizer: boolean;
      participantRating?: number | null;
      participantRatingCount: number;
    }>;
  } | null;
};

export type UserProfilePublicQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type UserProfilePublicQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'User';
    id: string;
    firstName: string;
    fullName: string;
    picture: string;
    university?: string | null;
    bio?: string | null;
    country?: string | null;
    homeUniversity?: string | null;
    instagram?: string | null;
    position?: string | null;
    studyProgram?: string | null;
    organizedEventsCount: number;
    createdEventsCount: number;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
      status: MembershipStatus;
    } | null;
  };
  commonEvents: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: string;
    end: string;
  }>;
};

export type GetRegistrationCodeInfoQueryVariables = Exact<{
  code: Scalars['ID']['input'];
}>;

export type GetRegistrationCodeInfoQuery = {
  __typename?: 'Query';
  eventRegistrationCode: {
    __typename?: 'EventRegistrationCode';
    id: string;
    status: RegistrationStatus;
    registrationCreated?: {
      __typename?: 'EventRegistration';
      id: string;
      belongsToCurrentUser: boolean;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
          checkoutUrl?: string | null;
        } | null;
      }>;
    } | null;
    targetEvent: {
      __typename?: 'TumiEvent';
      id: string;
      registrationMode: RegistrationMode;
      title: string;
      start: string;
      prices?: any | null;
    };
  };
};

export type SubmitEventFeedbackMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  anonymousRating: Scalars['Boolean']['input'];
  rating: Scalars['Int']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
}>;

export type SubmitEventFeedbackMutation = {
  __typename?: 'Mutation';
  rateEvent: { __typename?: 'TumiEvent'; id: string; ratingPending: boolean };
};

export type UseRegistrationCodeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['JSON']['input']>;
}>;

export type UseRegistrationCodeMutation = {
  __typename?: 'Mutation';
  useRegistrationCode: {
    __typename?: 'EventRegistrationCode';
    id: string;
    status: RegistrationStatus;
    registrationCreated?: {
      __typename?: 'EventRegistration';
      id: string;
      belongsToCurrentUser: boolean;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
          checkoutSession: string;
        } | null;
      }>;
    } | null;
    targetEvent: {
      __typename?: 'TumiEvent';
      id: string;
      registrationMode: RegistrationMode;
      title: string;
      start: string;
      prices?: any | null;
    };
  };
};

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateUserInput;
  userId: Scalars['ID']['input'];
}>;

export type UpdateProfileMutation = {
  __typename?: 'Mutation';
  updateUser: {
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    university?: string | null;
    bio?: string | null;
    country?: string | null;
    homeUniversity?: string | null;
    instagram?: string | null;
    studyProgram?: string | null;
  };
};

export type UpdateUserInformationMutationVariables = Exact<{
  input: UpdateUserInput;
  userId: Scalars['ID']['input'];
}>;

export type UpdateUserInformationMutation = {
  __typename?: 'Mutation';
  updateUser: {
    __typename?: 'User';
    id: string;
    phone?: string | null;
    enrolmentStatus: EnrolmentStatus;
    communicationEmail?: string | null;
  };
};

export type UserRolesQueryVariables = Exact<{ [key: string]: never }>;

export type UserRolesQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    fullName: string;
    esnCardValidUntil?: string | null;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
      role: Role;
      status: MembershipStatus;
    } | null;
  } | null;
};

export type CreateSubmissionItemMutationVariables = Exact<{
  target?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  input: CreateSubmissionItemInput;
}>;

export type CreateSubmissionItemMutation = {
  __typename?: 'Mutation';
  createSubmissionItem: { __typename?: 'EventSubmissionItem'; id: string };
};

export type DeleteSubmissionItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteSubmissionItemMutation = {
  __typename?: 'Mutation';
  deleteSubmissionItem: { __typename?: 'EventSubmissionItem'; id: string };
};

export type SearchUserForTransactionQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;

export type SearchUserForTransactionQuery = {
  __typename?: 'Query';
  users: Array<{
    __typename?: 'User';
    id: string;
    fullName: string;
    email: string;
  }>;
};

export type TenantLoadEventsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  after?: InputMaybe<Scalars['DateTime']['input']>;
}>;

export type TenantLoadEventsQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    createdAt: string;
    publicationState: PublicationState;
    icon: string;
  }>;
};

export type LoadEventCategoriesForAdminQueryVariables = Exact<{
  [key: string]: never;
}>;

export type LoadEventCategoriesForAdminQuery = {
  __typename?: 'Query';
  eventTemplateCategories: Array<{
    __typename?: 'EventTemplateCategory';
    id: string;
    name: string;
    icon: string;
  }>;
};

export type CreateEventTemplateCategoryMutationVariables = Exact<{
  input: CreateEventTemplateCategoryInput;
}>;

export type CreateEventTemplateCategoryMutation = {
  __typename?: 'Mutation';
  createEventTemplateCategory: {
    __typename?: 'EventTemplateCategory';
    id: string;
    name: string;
    icon: string;
  };
};

export type DeleteEventTemplateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteEventTemplateCategoryMutation = {
  __typename?: 'Mutation';
  deleteEventTemplateCategory: {
    __typename?: 'EventTemplateCategory';
    id: string;
    name: string;
    icon: string;
  };
};

export type GetRegistrationsQueryVariables = Exact<{
  pageLength?: InputMaybe<Scalars['Int']['input']>;
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetRegistrationsQuery = {
  __typename?: 'Query';
  registrations: Array<{
    __typename?: 'EventRegistration';
    id: string;
    createdAt: string;
    type: RegistrationType;
    balance: any;
    event: {
      __typename?: 'TumiEvent';
      title: string;
      id: string;
      icon: string;
    };
    user: {
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
      currentTenant?: {
        __typename?: 'UsersOfTenants';
        userId: string;
        tenantId: string;
        status: MembershipStatus;
      } | null;
    };
    transactions: Array<{
      __typename?: 'Transaction';
      id: string;
      status: TransactionStatus;
      direction: TransactionDirection;
      amount: any;
      type: TransactionType;
      subject: string;
      stripePayment?: {
        __typename?: 'StripePayment';
        id: string;
        status: string;
        netAmount?: any | null;
      } | null;
    }>;
  }>;
};

export type GetRegistrationForAdminQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetRegistrationForAdminQuery = {
  __typename?: 'Query';
  registration: {
    __typename?: 'EventRegistration';
    id: string;
    createdAt: string;
    type: RegistrationType;
    status: RegistrationStatus;
    cancellationReason?: string | null;
    event: {
      __typename?: 'TumiEvent';
      title: string;
      id: string;
      start: string;
      end: string;
      icon: string;
    };
    user: {
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
      currentTenant?: {
        __typename?: 'UsersOfTenants';
        userId: string;
        tenantId: string;
        status: MembershipStatus;
      } | null;
    };
    transactions: Array<{
      __typename?: 'Transaction';
      id: string;
      status: TransactionStatus;
      direction: TransactionDirection;
      amount: any;
      type: TransactionType;
      subject: string;
      stripePayment?: {
        __typename?: 'StripePayment';
        id: string;
        status: string;
        netAmount?: any | null;
        refundedAmount?: any | null;
        amount: any;
        feeAmount?: any | null;
        paymentIntent?: string | null;
        paymentMethodType?: string | null;
        events: any;
      } | null;
    }>;
  };
};

export type GetRegistrationCountQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetRegistrationCountQuery = {
  __typename?: 'Query';
  registrationCount: number;
};

export type GetCancelledRegistrationsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCancelledRegistrationsQuery = {
  __typename?: 'Query';
  registrations: Array<{
    __typename?: 'EventRegistration';
    id: string;
    createdAt: string;
    cancellationReason?: string | null;
    event: { __typename?: 'TumiEvent'; title: string; id: string };
    user: { __typename?: 'User'; id: string; fullName: string };
  }>;
};

export type GetEventRegistrationCodesQueryVariables = Exact<{
  pageLength?: InputMaybe<Scalars['Int']['input']>;
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetEventRegistrationCodesQuery = {
  __typename?: 'Query';
  eventRegistrationCodes: Array<{
    __typename?: 'EventRegistrationCode';
    id: string;
    createdAt: string;
    isPublic: boolean;
    status: RegistrationStatus;
    targetEvent: {
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
    };
    creator: {
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
      currentTenant?: {
        __typename?: 'UsersOfTenants';
        userId: string;
        tenantId: string;
        status: MembershipStatus;
      } | null;
    };
    registrationToRemove?: {
      __typename?: 'EventRegistration';
      id: string;
    } | null;
    registrationCreated?: {
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    } | null;
  }>;
};

export type GetEventRegistrationCodeQueryVariables = Exact<{
  registrationId: Scalars['ID']['input'];
}>;

export type GetEventRegistrationCodeQuery = {
  __typename?: 'Query';
  eventRegistrationCode: {
    __typename?: 'EventRegistrationCode';
    id: string;
    createdAt: string;
    isPublic: boolean;
    status: RegistrationStatus;
    sepaAllowed: boolean;
    targetEvent: {
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      start: string;
      end: string;
      icon: string;
    };
    creator: {
      __typename?: 'User';
      id: string;
      email: string;
      fullName: string;
      picture: string;
      currentTenant?: {
        __typename?: 'UsersOfTenants';
        userId: string;
        tenantId: string;
        status: MembershipStatus;
      } | null;
    };
    connectedRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      status: RegistrationStatus;
      cancellationReason?: string | null;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
          paymentMethodType?: string | null;
          paymentIntent?: string | null;
          events: any;
        } | null;
      }>;
    }>;
    registrationToRemove?: {
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      status: RegistrationStatus;
      cancellationReason?: string | null;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
          paymentMethodType?: string | null;
          paymentIntent?: string | null;
          events: any;
        } | null;
      }>;
    } | null;
    registrationCreated?: {
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      status: RegistrationStatus;
      cancellationReason?: string | null;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
          paymentIntent?: string | null;
          paymentMethodType?: string | null;
          events: any;
        } | null;
      }>;
    } | null;
  };
};

export type GetEventRegistrationCodeCountQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetEventRegistrationCodeCountQuery = {
  __typename?: 'Query';
  eventRegistrationCodeCount: number;
};

export type LoadTransactionsQueryVariables = Exact<{
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  directions?: InputMaybe<Array<TransactionDirection> | TransactionDirection>;
  types?: InputMaybe<Array<TransactionType> | TransactionType>;
  status?: InputMaybe<Array<TransactionStatus> | TransactionStatus>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;

export type LoadTransactionsQuery = {
  __typename?: 'Query';
  transactionCount: number;
  transactionNetAmount: any;
  transactions: Array<{
    __typename?: 'Transaction';
    id: string;
    amount: any;
    createdAt: string;
    type: TransactionType;
    subject: string;
    status: TransactionStatus;
    direction: TransactionDirection;
    eventRegistration?: {
      __typename?: 'EventRegistration';
      id: string;
      event: { __typename?: 'TumiEvent'; id: string; title: string };
    } | null;
    user?: { __typename?: 'User'; id: string; fullName: string } | null;
  }>;
};

export type CreateOrganizerMutationVariables = Exact<{
  input: NewOrganizerInput;
}>;

export type CreateOrganizerMutation = {
  __typename?: 'Mutation';
  createEventOrganizer: { __typename?: 'EventOrganizer'; id: string };
};

export type LoadEventsWithBookingQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']['input']>;
}>;

export type LoadEventsWithBookingQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    start: string;
    icon: string;
    registrationMode: RegistrationMode;
    registrationStart: string;
    participantLimit: number;
    participantRegistrationCount: number;
    countedParticipantRegistrations: number;
    organizer: { __typename?: 'EventOrganizer'; id: string; name: string };
  }>;
};

export type LoadEventsWithRatingQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']['input']>;
}>;

export type LoadEventsWithRatingQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    start: string;
    icon: string;
    participantRating?: number | null;
    participantRatingCount: number;
    organizerRating?: number | null;
    organizerRatingCount: number;
    ratings: Array<{
      __typename?: 'EventRegistration';
      userComment?: string | null;
      rating?: number | null;
      type: RegistrationType;
      anonymousRating: boolean;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        currentTenant?: {
          __typename?: 'UsersOfTenants';
          userId: string;
          tenantId: string;
          status: MembershipStatus;
        } | null;
      };
    }>;
    organizer: { __typename?: 'EventOrganizer'; id: string; name: string };
  }>;
};

export type LoadAllPhotosQueryVariables = Exact<{ [key: string]: never }>;

export type LoadAllPhotosQuery = {
  __typename?: 'Query';
  photos: Array<{
    __typename?: 'PhotoShare';
    id: string;
    cols: number;
    rows: number;
    src: string;
    original: string;
    originalBlob: string;
    type: string;
    event: { __typename?: 'TumiEvent'; id: string; title: string };
    creator: { __typename?: 'User'; id: string; fullName: string };
  }>;
};

export type LoadUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type LoadUserQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'User';
    id: string;
    authId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    birthdate?: string | null;
    phone?: string | null;
    university?: string | null;
    esnCardValidUntil?: string | null;
    esnCardNumber?: string | null;
    position?: string | null;
    picture: string;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
      role: Role;
      status: MembershipStatus;
    } | null;
    eventRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      createdAt: string;
      checkInTime?: string | null;
      type: RegistrationType;
      status: RegistrationStatus;
      deletingCode?: {
        __typename?: 'EventRegistrationCode';
        id: string;
        createdAt: string;
      } | null;
      creatingCode?: {
        __typename?: 'EventRegistrationCode';
        id: string;
        createdAt: string;
      } | null;
      transactions: Array<{
        __typename?: 'Transaction';
        id: string;
        status: TransactionStatus;
        direction: TransactionDirection;
        amount: any;
        type: TransactionType;
        subject: string;
        stripePayment?: {
          __typename?: 'StripePayment';
          id: string;
          status: string;
          events: any;
        } | null;
      }>;
      event: {
        __typename?: 'TumiEvent';
        id: string;
        title: string;
        start: string;
        end: string;
        icon: string;
      };
    }>;
  };
};

export type GetTenantForEditQueryVariables = Exact<{ [key: string]: never }>;

export type GetTenantForEditQuery = {
  __typename?: 'Query';
  currentTenant: {
    __typename?: 'Tenant';
    id: string;
    name: string;
    imprintPage: string;
    aboutPage: string;
    privacyPolicyPage: string;
    faqPage?: string | null;
    tacPage?: string | null;
    homePageLink?: string | null;
    homePageStrategy: HomePageStrategy;
    currency: Currency;
    communicationEmail: string;
    settings: {
      __typename?: 'TenantSettings';
      showPWAInstall: boolean;
      brandIconUrl?: string | null;
      esnCardLink?: string | null;
      socialLinks: Array<{
        __typename?: 'ResourceLink';
        label: string;
        icon: string;
        url: string;
      }>;
      sectionHubLinks: Array<{
        __typename?: 'ResourceLink';
        label: string;
        icon: string;
        url: string;
      }>;
      deRegistrationOptions: {
        __typename?: 'GlobalDeRegistrationConfig';
        free: {
          __typename?: 'DeRegistrationConfig';
          organizers: {
            __typename?: 'OrganizerDeRegistrationSettings';
            deRegistrationPossible: boolean;
            minimumDaysForDeRegistration: number;
            refundFeesOnDeRegistration: boolean;
          };
          participants: {
            __typename?: 'ParticipantDeRegistrationSettings';
            deRegistrationPossible: boolean;
            minimumDaysForDeRegistration: number;
            refundFeesOnDeRegistration: boolean;
            movePossible: boolean;
            minimumDaysForMove: number;
            refundFeesOnMove: boolean;
          };
        };
        paid: {
          __typename?: 'DeRegistrationConfig';
          organizers: {
            __typename?: 'OrganizerDeRegistrationSettings';
            deRegistrationPossible: boolean;
            minimumDaysForDeRegistration: number;
            refundFeesOnDeRegistration: boolean;
          };
          participants: {
            __typename?: 'ParticipantDeRegistrationSettings';
            deRegistrationPossible: boolean;
            minimumDaysForDeRegistration: number;
            refundFeesOnDeRegistration: boolean;
            movePossible: boolean;
            minimumDaysForMove: number;
            refundFeesOnMove: boolean;
          };
        };
      };
    };
  };
};

export type GetOrganizersQueryVariables = Exact<{ [key: string]: never }>;

export type GetOrganizersQuery = {
  __typename?: 'Query';
  eventOrganizers: Array<{
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
    text: string;
  }>;
};

export type GetUsersQueryVariables = Exact<{
  roleList?: InputMaybe<Array<Role> | Role>;
  statusList?: InputMaybe<Array<MembershipStatus> | MembershipStatus>;
  search?: InputMaybe<Scalars['String']['input']>;
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
  pageLength?: InputMaybe<Scalars['Int']['input']>;
  emptyOnEmptySearch?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetUsersQuery = {
  __typename?: 'Query';
  userSearchResultNum: number;
  users: Array<{
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    position?: string | null;
    picture: string;
    currentTenant?: {
      __typename?: 'UsersOfTenants';
      userId: string;
      tenantId: string;
      role: Role;
      status: MembershipStatus;
    } | null;
  }>;
};

export type GetStatisticsQueryVariables = Exact<{
  range?: InputMaybe<DateRangeInput>;
  tenantId?: InputMaybe<Scalars['ID']['input']>;
}>;

export type GetStatisticsQuery = {
  __typename?: 'Query';
  statistics: {
    __typename?: 'Statistics';
    usersRegistered: number;
    registrations: number;
    userHistory: any;
    registrationHistory: any;
    checkinHistory: any;
    userEventDistribution: any;
    usersRegisteredEvents: number;
    usersRegisteredFreeEvents: number;
    usersRegisteredPaidEvents: number;
    checkins: number;
    paidRegistrations: number;
    totalEvents: number;
    paidEvents: number;
    userUniversityDistribution: any;
    userStatusDistribution: any;
    localStatusDistribution: any;
  };
};

export type UpdateTenantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateTenantInput;
}>;

export type UpdateTenantMutation = {
  __typename?: 'Mutation';
  updateTenant: {
    __typename?: 'Tenant';
    id: string;
    faqPage?: string | null;
    imprintPage: string;
    privacyPolicyPage: string;
    aboutPage: string;
    tacPage?: string | null;
    homePageLink?: string | null;
    homePageStrategy: HomePageStrategy;
    currency: Currency;
    communicationEmail: string;
    settings: {
      __typename?: 'TenantSettings';
      brandIconUrl?: string | null;
      showPWAInstall: boolean;
      esnCardLink?: string | null;
      socialLinks: Array<{
        __typename?: 'ResourceLink';
        label: string;
        icon: string;
        url: string;
      }>;
      sectionHubLinks: Array<{
        __typename?: 'ResourceLink';
        label: string;
        icon: string;
        url: string;
      }>;
    };
  };
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  role: Role;
  status: MembershipStatus;
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUserPosition: { __typename?: 'User'; position?: string | null };
  updateUserRole: {
    __typename?: 'UsersOfTenants';
    userId: string;
    tenantId: string;
    role: Role;
  };
  updateUserStatus: {
    __typename?: 'UsersOfTenants';
    userId: string;
    tenantId: string;
    status: MembershipStatus;
  };
};

export type GetTutorHubInfoQueryVariables = Exact<{ [key: string]: never }>;

export type GetTutorHubInfoQuery = {
  __typename?: 'Query';
  currentTenant: {
    __typename?: 'Tenant';
    id: string;
    name: string;
    tutorHub: any;
    settings: {
      __typename?: 'TenantSettings';
      sectionHubLinks: Array<{
        __typename?: 'ResourceLink';
        label: string;
        icon: string;
        url: string;
      }>;
    };
  };
};

export type GetTutorHubEventsQueryVariables = Exact<{
  range?: InputMaybe<DateRangeInput>;
}>;

export type GetTutorHubEventsQuery = {
  __typename?: 'Query';
  currentTenant: { __typename?: 'Tenant'; id: string; tutorHubEvents: any };
};

export const GetCurrentUserDocument = gql`
  query getCurrentUser {
    currentUser {
      id
      profileComplete
      firstName
      lastName
      email
      phone
      picture
      university
      enrolmentStatus
      birthdate
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserGQL extends Apollo.Query<
  GetCurrentUserQuery,
  GetCurrentUserQueryVariables
> {
  override document = GetCurrentUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCurrentUserInfoDocument = gql`
  query getCurrentUserInfo {
    currentUser {
      id
      outstandingRating
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserInfoGQL extends Apollo.Query<
  GetCurrentUserInfoQuery,
  GetCurrentUserInfoQueryVariables
> {
  override document = GetCurrentUserInfoDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTenantInfoDocument = gql`
  query getTenantInfo {
    currentTenant {
      id
      name
      faqPage
      homePageStrategy
      homePageLink
      communicationEmail
      settings {
        showPWAInstall
        brandIconUrl
        socialLinks {
          icon
          url
          label
        }
        sectionHubLinks {
          label
          icon
          url
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTenantInfoGQL extends Apollo.Query<
  GetTenantInfoQuery,
  GetTenantInfoQueryVariables
> {
  override document = GetTenantInfoDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTenantCurrencyCodeDocument = gql`
  query getTenantCurrencyCode {
    currentTenant {
      id
      currency
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTenantCurrencyCodeGQL extends Apollo.Query<
  GetTenantCurrencyCodeQuery,
  GetTenantCurrencyCodeQueryVariables
> {
  override document = GetTenantCurrencyCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateEventTemplateDocument = gql`
  mutation createEventTemplate($input: CreateEventTemplateInput!) {
    createEventTemplate(input: $input) {
      id
      createdAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateEventTemplateGQL extends Apollo.Mutation<
  CreateEventTemplateMutation,
  CreateEventTemplateMutationVariables
> {
  override document = CreateEventTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateEventFromTemplateDocument = gql`
  mutation createEventFromTemplate(
    $templateId: ID!
    $eventData: CreateEventFromTemplateInput!
  ) {
    createEventFromTemplate(templateId: $templateId, input: $eventData) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateEventFromTemplateGQL extends Apollo.Mutation<
  CreateEventFromTemplateMutation,
  CreateEventFromTemplateMutationVariables
> {
  override document = CreateEventFromTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateTemplateLocationDocument = gql`
  mutation updateTemplateLocation(
    $templateId: ID!
    $update: UpdateTemplateLocationInput!
  ) {
    updateTemplateLocation(templateId: $templateId, location: $update) {
      id
      location
      coordinates
      googlePlaceUrl
      isVirtual
      onlineMeetingUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateTemplateLocationGQL extends Apollo.Mutation<
  UpdateTemplateLocationMutation,
  UpdateTemplateLocationMutationVariables
> {
  override document = UpdateTemplateLocationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateEventTemplateCategoryAssignmentDocument = gql`
  mutation updateEventTemplateCategoryAssignment(
    $templateId: ID!
    $categoryId: ID!
  ) {
    updateTemplateCategory(templateId: $templateId, categoryId: $categoryId) {
      id
      category {
        id
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateEventTemplateCategoryAssignmentGQL extends Apollo.Mutation<
  UpdateEventTemplateCategoryAssignmentMutation,
  UpdateEventTemplateCategoryAssignmentMutationVariables
> {
  override document = UpdateEventTemplateCategoryAssignmentDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateEventTemplateDocument = gql`
  mutation updateEventTemplate(
    $templateId: ID!
    $update: UpdateTemplateInput!
  ) {
    updateTemplate(templateId: $templateId, input: $update) {
      id
      title
      icon
      duration
      description
      organizerText
      participantText
      comment
      location
      coordinates
      comment
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateEventTemplateGQL extends Apollo.Mutation<
  UpdateEventTemplateMutation,
  UpdateEventTemplateMutationVariables
> {
  override document = UpdateEventTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteEventTemplateDocument = gql`
  mutation deleteEventTemplate($templateId: ID!) {
    deleteTemplate(templateId: $templateId) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteEventTemplateGQL extends Apollo.Mutation<
  DeleteEventTemplateMutation,
  DeleteEventTemplateMutationVariables
> {
  override document = DeleteEventTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteTemplateDocument = gql`
  mutation deleteTemplate($id: ID!) {
    deleteTemplate(templateId: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteTemplateGQL extends Apollo.Mutation<
  DeleteTemplateMutation,
  DeleteTemplateMutationVariables
> {
  override document = DeleteTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventTemplatesDocument = gql`
  query getEventTemplates {
    eventTemplates {
      id
      title
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventTemplatesGQL extends Apollo.Query<
  GetEventTemplatesQuery,
  GetEventTemplatesQueryVariables
> {
  override document = GetEventTemplatesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTemplateCategoriesWithTemplatesDocument = gql`
  query getTemplateCategoriesWithTemplates {
    eventTemplateCategories {
      id
      name
      icon
      eventCount
      templateCount
      templates {
        id
        title
        icon
        participantRating
        participantRatingCount
        eventInstanceCount
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTemplateCategoriesWithTemplatesGQL extends Apollo.Query<
  GetTemplateCategoriesWithTemplatesQuery,
  GetTemplateCategoriesWithTemplatesQueryVariables
> {
  override document = GetTemplateCategoriesWithTemplatesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventTemplateCategoriesDocument = gql`
  query getEventTemplateCategories {
    eventTemplateCategories {
      id
      name
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventTemplateCategoriesGQL extends Apollo.Query<
  GetEventTemplateCategoriesQuery,
  GetEventTemplateCategoriesQueryVariables
> {
  override document = GetEventTemplateCategoriesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetLonelyEventTemplatesDocument = gql`
  query getLonelyEventTemplates {
    eventTemplates(onlyWithoutCategory: true) {
      id
      title
      icon
      participantRating
      participantRatingCount
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetLonelyEventTemplatesGQL extends Apollo.Query<
  GetLonelyEventTemplatesQuery,
  GetLonelyEventTemplatesQueryVariables
> {
  override document = GetLonelyEventTemplatesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventTemplateDocument = gql`
  query getEventTemplate($id: ID!) {
    eventTemplate(id: $id) {
      id
      title
      icon
      duration
      description
      organizerText
      participantText
      comment
      location
      coordinates
      googlePlaceUrl
      isVirtual
      onlineMeetingUrl
      finances
      medianParticipantCount
      medianOrganizerCount
      category {
        id
        name
        icon
      }
      eventInstances {
        id
        title
        start
        participantRating
        participantRatingCount
        organizerRating
        organizerRatingCount
        signupVelocity {
          quarter
          quarterTime
          quarterCount
          fifty
          fiftyTime
          fiftyCount
          threequarters
          threequartersTime
          threequartersCount
        }
        ratings {
          userComment
          rating
          type
          anonymousRating
          user {
            id
            fullName
            picture
            currentTenant {
              userId
              tenantId
              status
            }
          }
        }
        organizer {
          id
          name
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventTemplateGQL extends Apollo.Query<
  GetEventTemplateQuery,
  GetEventTemplateQueryVariables
> {
  override document = GetEventTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateFinancesDocument = gql`
  mutation updateFinances($id: ID!, $finances: JSON!) {
    updateTemplateFinances(templateId: $id, finances: $finances) {
      id
      finances
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateFinancesGQL extends Apollo.Mutation<
  UpdateFinancesMutation,
  UpdateFinancesMutationVariables
> {
  override document = UpdateFinancesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOrganizerOptionsDocument = gql`
  query getOrganizerOptions {
    eventOrganizers {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOrganizerOptionsGQL extends Apollo.Query<
  GetOrganizerOptionsQuery,
  GetOrganizerOptionsQueryVariables
> {
  override document = GetOrganizerOptionsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCostItemsForEventDocument = gql`
  query getCostItemsForEvent($eventId: ID!) {
    costItems(eventId: $eventId) {
      id
      name
      calculationInfo
      amount
      notSubsidized
      onInvoice
      submittedAmount
    }
    event(id: $eventId) {
      id
      eventTemplate {
        id
        finances
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCostItemsForEventGQL extends Apollo.Query<
  GetCostItemsForEventQuery,
  GetCostItemsForEventQueryVariables
> {
  override document = GetCostItemsForEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateCostItemsFromTemplateDocument = gql`
  mutation updateCostItemsFromTemplate($eventId: ID!) {
    updateCostItemsFromTemplate(eventId: $eventId) {
      id
      costItems {
        id
        name
        calculationInfo
        amount
        notSubsidized
        onInvoice
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateCostItemsFromTemplateGQL extends Apollo.Mutation<
  UpdateCostItemsFromTemplateMutation,
  UpdateCostItemsFromTemplateMutationVariables
> {
  override document = UpdateCostItemsFromTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RegisterForEventDocument = gql`
  mutation registerForEvent(
    $eventId: ID!
    $type: RegistrationType
    $submissions: JSON
    $price: JSON
  ) {
    registerForEvent(
      eventId: $eventId
      registrationType: $type
      submissions: $submissions
      price: $price
    ) {
      id
      organizerRegistrationPossible
      participantRegistrationPossible
      organizersRegistered
      participantRegistrationCount
      couldBeOrganizer
      userIsRegistered
      activeRegistration {
        id
        type
        status
        cancellationReason
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            createdAt
            amount
            status
            checkoutUrl
            paymentIntent
          }
        }
      }
      organizers {
        fullName
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RegisterForEventGQL extends Apollo.Mutation<
  RegisterForEventMutation,
  RegisterForEventMutationVariables
> {
  override document = RegisterForEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeregisterFromEventDocument = gql`
  mutation deregisterFromEvent($registrationId: ID!) {
    deregisterFromEvent(registrationId: $registrationId) {
      id
      participantRegistrationPossible
      participantRegistrations(includeCancelled: true) {
        id
        status
      }
      activeRegistration {
        id
      }
      organizers {
        id
        fullName
        picture
      }
      participantRegistrationCount
      userIsRegistered
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeregisterFromEventGQL extends Apollo.Mutation<
  DeregisterFromEventMutation,
  DeregisterFromEventMutationVariables
> {
  override document = DeregisterFromEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CancelPaymentDocument = gql`
  mutation cancelPayment($registrationId: ID!) {
    cancelPayment(registrationId: $registrationId) {
      id
      userIsRegistered
      participantRegistrationPossible
      activeRegistration {
        id
        type
        status
        cancellationReason
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            createdAt
            amount
            status
            checkoutSession
            paymentIntent
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CancelPaymentGQL extends Apollo.Mutation<
  CancelPaymentMutation,
  CancelPaymentMutationVariables
> {
  override document = CancelPaymentDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadRegistrationForMoveDocument = gql`
  query loadRegistrationForMove($registrationId: ID!) {
    registration(id: $registrationId) {
      id
      eventId
      deletingCode {
        id
        isPublic
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadRegistrationForMoveGQL extends Apollo.Query<
  LoadRegistrationForMoveQuery,
  LoadRegistrationForMoveQueryVariables
> {
  override document = LoadRegistrationForMoveDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const VerifyCertificateDocument = gql`
  mutation verifyCertificate($cert: String!) {
    verifyDCC(certificate: $cert) {
      status
      card {
        name
        test
        vaccination
        recovery
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyCertificateGQL extends Apollo.Mutation<
  VerifyCertificateMutation,
  VerifyCertificateMutationVariables
> {
  override document = VerifyCertificateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateEventRegistrationCodeDocument = gql`
  mutation createEventRegistrationCode(
    $eventId: ID!
    $registrationId: ID
    $isPublic: Boolean
    $sepaAllowed: Boolean
  ) {
    createRegistrationCode(
      eventId: $eventId
      registrationId: $registrationId
      isPublic: $isPublic
      sepaAllowed: $sepaAllowed
    ) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateEventRegistrationCodeGQL extends Apollo.Mutation<
  CreateEventRegistrationCodeMutation,
  CreateEventRegistrationCodeMutationVariables
> {
  override document = CreateEventRegistrationCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventForRunningDocument = gql`
  query loadEventForRunning($id: ID!) {
    event(id: $id) {
      id
      title
      icon
      start
      end
      participantLimit
      participantRegistrationCount
      participantsAttended
      mailTemplate
      createdBy {
        id
        fullName
      }
      organizerRegistrations {
        id
        checkInTime
        user {
          id
          fullName
          phone
          picture
          email
          communicationEmail
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
      costItems(hideOnInvoice: true) {
        id
        amount
        actualAmount
        submittedAmount
        name
        receipts {
          id
        }
      }
      submissionItems {
        id
        name
      }
      participantRegistrations(includePending: false) {
        id
        checkInTime
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
          }
        }
        submissions {
          id
          data
          submissionItem {
            id
            name
          }
        }
        user {
          id
          fullName
          phone
          picture
          email
          esnCardValidUntil
          esnCardNumber
          communicationEmail
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventForRunningGQL extends Apollo.Query<
  LoadEventForRunningQuery,
  LoadEventForRunningQueryVariables
> {
  override document = LoadEventForRunningDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCostItemDocument = gql`
  query getCostItem($id: ID!) {
    costItem(id: $id) {
      id
      name
      amount
      submittedAmount
      event {
        id
        title
      }
      receipts {
        id
        createdAt
        amount
        url
        type
        originalUrl
        user {
          id
          fullName
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCostItemGQL extends Apollo.Query<
  GetCostItemQuery,
  GetCostItemQueryVariables
> {
  override document = GetCostItemDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetBlobTokenDocument = gql`
  query getBlobToken {
    blobUploadKey
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetBlobTokenGQL extends Apollo.Query<
  GetBlobTokenQuery,
  GetBlobTokenQueryVariables
> {
  override document = GetBlobTokenDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddReceiptDocument = gql`
  mutation addReceipt($costItemId: ID!, $receiptInput: CreateReceiptInput!) {
    createReceipt(costItemId: $costItemId, input: $receiptInput) {
      id
      amount
      url
      costItem {
        id
        receipts {
          id
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddReceiptGQL extends Apollo.Mutation<
  AddReceiptMutation,
  AddReceiptMutationVariables
> {
  override document = AddReceiptDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteReceiptDocument = gql`
  mutation deleteReceipt($receiptId: ID!) {
    deleteReceipt(id: $receiptId) {
      id
      costItem {
        id
        receipts {
          id
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteReceiptGQL extends Apollo.Mutation<
  DeleteReceiptMutation,
  DeleteReceiptMutationVariables
> {
  override document = DeleteReceiptDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetRegistrationDocument = gql`
  query getRegistration($id: ID!) {
    registration(id: $id) {
      id
      transactions {
        id
        status
        direction
        amount
        type
        subject
        stripePayment {
          id
          status
        }
      }
      type
      didAttend
      checkInTime
      event {
        id
        title
        icon
      }
      user {
        id
        fullName
        picture
        esnCardNumber
        esnCardValidUntil
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRegistrationGQL extends Apollo.Query<
  GetRegistrationQuery,
  GetRegistrationQueryVariables
> {
  override document = GetRegistrationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CheckInUserDocument = gql`
  mutation checkInUser($id: ID!, $manual: Boolean) {
    checkInUser(registrationId: $id, manualCheckin: $manual) {
      id
      checkInTime
      didAttend
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CheckInUserGQL extends Apollo.Mutation<
  CheckInUserMutation,
  CheckInUserMutationVariables
> {
  override document = CheckInUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetUserPaymentStatusDocument = gql`
  query GetUserPaymentStatus {
    currentUser {
      id
      currentTenant {
        userId
        tenantId
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetUserPaymentStatusGQL extends Apollo.Query<
  GetUserPaymentStatusQuery,
  GetUserPaymentStatusQueryVariables
> {
  override document = GetUserPaymentStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const KickFromEventDocument = gql`
  mutation kickFromEvent(
    $registrationId: ID!
    $withRefund: Boolean!
    $refundFees: Boolean!
  ) {
    kickFromEvent(
      registrationId: $registrationId
      withRefund: $withRefund
      refundFees: $refundFees
    ) {
      id
      participantRegistrations(includeCancelled: true) {
        id
        status
      }
      activeRegistration {
        id
      }
      organizers {
        id
        fullName
        picture
      }
      participantRegistrationCount
      userIsRegistered
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class KickFromEventGQL extends Apollo.Mutation<
  KickFromEventMutation,
  KickFromEventMutationVariables
> {
  override document = KickFromEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadUsersByStatusDocument = gql`
  query loadUsersByStatus($allowList: [MembershipStatus!]!) {
    users(statusList: $allowList) {
      id
      fullName
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadUsersByStatusGQL extends Apollo.Query<
  LoadUsersByStatusQuery,
  LoadUsersByStatusQueryVariables
> {
  override document = LoadUsersByStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const EventListDocument = gql`
  query eventList($after: DateTime, $before: DateTime) {
    events(after: $after, before: $before) {
      id
      title
      icon
      start
      end
      registrationStart
      organizerRegistrationStart
      prices
      organizerLimit
      organizersRegistered
      participantRegistrationCount
      participantLimit
      couldBeOrganizer
      publicationState
      registrationMode
      userIsRegistered
      userIsOrganizer
      internalEvent
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EventListGQL extends Apollo.Query<
  EventListQuery,
  EventListQueryVariables
> {
  override document = EventListDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventDocument = gql`
  query loadEvent($id: ID!) {
    event(id: $id) {
      id
      title
      icon
      start
      end
      registrationStart
      organizerRegistrationStart
      enablePhotoSharing
      publicationState
      description
      organizerText
      organizerLimit
      participantText
      registrationMode
      registrationLink
      freeParticipantSpots
      excludeFromRatings
      ratingPending
      prices
      location
      coordinates
      googlePlaceUrl
      isVirtual
      onlineMeetingUrl
      deRegistrationSettings {
        organizers {
          deRegistrationPossible
          minimumDaysForDeRegistration
        }
        participants {
          deRegistrationPossible
          minimumDaysForDeRegistration
          refundFeesOnDeRegistration
          movePossible
          minimumDaysForMove
          refundFeesOnMove
        }
      }
      createdBy {
        id
        fullName
        picture
        currentTenant {
          userId
          tenantId
          status
        }
      }
      submissionItems(submissionTime: REGISTRATION) {
        id
        name
        submissionTime
        instruction
        required
        type
        data
        ownSubmissions {
          id
          data
        }
      }
      organizer {
        id
        link
        text
      }
      activeRegistration {
        id
        didAttend
        status
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            createdAt
            amount
            status
            paymentIntent
            checkoutUrl
          }
        }
        user {
          id
          fullName
        }
        userComment
        rating
        anonymousRating
      }
      organizerLimit
      organizerSignup
      participantSignup
      organizerRegistrationPossible
      participantRegistrationPossible
      userIsRegistered
      userIsOrganizer
      userIsCreator
      participantLimit
      ratings {
        userComment
        rating
        type
        anonymousRating
        user {
          id
          fullName
          picture
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
      participantRegistrationCount
      couldBeOrganizer
      couldBeParticipant
      organizers {
        id
        fullName
        phone
        picture
        currentTenant {
          userId
          tenantId
          status
        }
      }
      participantRating
      participantRatingCount
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventGQL extends Apollo.Query<
  LoadEventQuery,
  LoadEventQueryVariables
> {
  override document = LoadEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeRegisterOrganizerFromEventDocument = gql`
  mutation deRegisterOrganizerFromEvent($registrationId: ID!) {
    deregisterOrganizerFromEvent(registrationId: $registrationId) {
      id
      organizerRegistrationPossible
      organizerRegistrations {
        id
        status
      }
      activeRegistration {
        id
      }
      organizers {
        id
        fullName
        picture
      }
      organizersRegistered
      userIsOrganizer
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeRegisterOrganizerFromEventGQL extends Apollo.Mutation<
  DeRegisterOrganizerFromEventMutation,
  DeRegisterOrganizerFromEventMutationVariables
> {
  override document = DeRegisterOrganizerFromEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadUserForEventDocument = gql`
  query loadUserForEvent {
    currentUser {
      id
      esnCardValidUntil
      university
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadUserForEventGQL extends Apollo.Query<
  LoadUserForEventQuery,
  LoadUserForEventQueryVariables
> {
  override document = LoadUserForEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventForEditDocument = gql`
  query loadEventForEdit($id: ID!) {
    event(id: $id) {
      coordinates
      couldBeOrganizer
      couldBeParticipant
      createdBy {
        id
      }
      description
      end
      eventOrganizerId
      excludeFromRatings
      excludeFromStatistics
      enablePhotoSharing
      icon
      id
      location
      googlePlaceId
      googlePlaceUrl
      isVirtual
      onlineMeetingUrl
      organizerLimit
      organizerRegistrationPossible
      organizerSignup
      organizerText
      organizerRegistrationStart
      participantLimit
      participantSignup
      participantText
      prices
      publicationState
      registrationLink
      registrationMode
      registrationStart
      start
      title
      deRegistrationSettings {
        organizers {
          deRegistrationPossible
          minimumDaysForDeRegistration
        }
        participants {
          deRegistrationPossible
          minimumDaysForDeRegistration
          refundFeesOnDeRegistration
          movePossible
          minimumDaysForMove
          refundFeesOnMove
        }
      }
      eventTemplate {
        id
        title
      }
      submissionItems {
        id
        createdAt
        required
        submissionTime
        type
        instruction
        name
        data
      }
      organizerRegistrations {
        id
        user {
          id
          picture
          fullName
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
      organizers {
        fullName
        picture
        id
      }
    }
    currentUser {
      id
      currentTenant {
        userId
        tenantId
        role
        status
      }
    }
    eventOrganizers {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventForEditGQL extends Apollo.Query<
  LoadEventForEditQuery,
  LoadEventForEditQueryVariables
> {
  override document = LoadEventForEditDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateEventTemplateConnectionDocument = gql`
  mutation updateEventTemplateConnection($eventId: ID!, $templateId: ID!) {
    updateEventTemplateConnection(eventId: $eventId, templateId: $templateId) {
      id
      eventTemplate {
        id
        title
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateEventTemplateConnectionGQL extends Apollo.Mutation<
  UpdateEventTemplateConnectionMutation,
  UpdateEventTemplateConnectionMutationVariables
> {
  override document = UpdateEventTemplateConnectionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteEventDocument = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteEventGQL extends Apollo.Mutation<
  DeleteEventMutation,
  DeleteEventMutationVariables
> {
  override document = DeleteEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddOrganizerToEventDocument = gql`
  mutation addOrganizerToEvent($eventId: ID!, $userId: ID!) {
    addOrganizerToEvent(eventId: $eventId, userId: $userId) {
      id
      organizers {
        fullName
        picture
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddOrganizerToEventGQL extends Apollo.Mutation<
  AddOrganizerToEventMutation,
  AddOrganizerToEventMutationVariables
> {
  override document = AddOrganizerToEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateGeneralEventDocument = gql`
  mutation updateGeneralEvent($id: ID!, $data: UpdateGeneralEventInput!) {
    updateEventGeneralInfo(eventId: $id, input: $data) {
      id
      description
      organizerText
      participantText
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateGeneralEventGQL extends Apollo.Mutation<
  UpdateGeneralEventMutation,
  UpdateGeneralEventMutationVariables
> {
  override document = UpdateGeneralEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateCoreEventDocument = gql`
  mutation updateCoreEvent($id: ID!, $data: UpdateCoreEventInput!) {
    updateEventCoreInfo(eventId: $id, input: $data) {
      id
      title
      icon
      start
      end
      registrationStart
      prices
      registrationMode
      registrationLink
      eventOrganizerId
      organizerSignup
      participantSignup
      participantLimit
      organizerLimit
      excludeFromRatings
      excludeFromStatistics
      enablePhotoSharing
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateCoreEventGQL extends Apollo.Mutation<
  UpdateCoreEventMutation,
  UpdateCoreEventMutationVariables
> {
  override document = UpdateCoreEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdatePublicationDocument = gql`
  mutation updatePublication($id: ID!, $state: PublicationState!) {
    changeEventPublication(eventId: $id, publicationState: $state) {
      id
      publicationState
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdatePublicationGQL extends Apollo.Mutation<
  UpdatePublicationMutation,
  UpdatePublicationMutationVariables
> {
  override document = UpdatePublicationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateEventLocationDocument = gql`
  mutation updateEventLocation(
    $eventId: ID!
    $update: UpdateEventLocationInput!
  ) {
    updateEventLocation(eventId: $eventId, input: $update) {
      id
      location
      coordinates
      isVirtual
      onlineMeetingUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateEventLocationGQL extends Apollo.Mutation<
  UpdateEventLocationMutation,
  UpdateEventLocationMutationVariables
> {
  override document = UpdateEventLocationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddSubmissionToEventDocument = gql`
  mutation addSubmissionToEvent(
    $eventId: ID!
    $submissionItem: CreateSubmissionItemInput!
  ) {
    createSubmissionItem(
      input: $submissionItem
      target: "event"
      targetId: $eventId
    ) {
      id
      createdAt
      required
      submissionTime
      type
      instruction
      name
      event {
        id
        submissionItems {
          id
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddSubmissionToEventGQL extends Apollo.Mutation<
  AddSubmissionToEventMutation,
  AddSubmissionToEventMutationVariables
> {
  override document = AddSubmissionToEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveSubmissionFromEventDocument = gql`
  mutation removeSubmissionFromEvent($submissionItemId: ID!) {
    deleteSubmissionItem(id: $submissionItemId) {
      id
      event {
        id
        submissionItems {
          id
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveSubmissionFromEventGQL extends Apollo.Mutation<
  RemoveSubmissionFromEventMutation,
  RemoveSubmissionFromEventMutationVariables
> {
  override document = RemoveSubmissionFromEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventForManagementDocument = gql`
  query loadEventForManagement($id: ID!) {
    event(id: $id) {
      id
      title
      icon
      start
      amountCollected
      netAmountCollected
      feesPaid
      refundFeesPaid
      plannedSpend
      submittedSpend
      participantLimit
      participantRegistrationCount
      participantsAttended
      registrationMode
      costItems {
        id
        name
        submittedAmount
        amount
      }
      eventTemplate {
        id
        title
      }
      eventRegistrationCodes {
        id
        createdAt
        isPublic
        status
        registrationToRemoveId
        registrationCreatedId
      }
      organizerRegistrations {
        id
        createdAt
        status
        user {
          id
          fullName
          picture
          email
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
      participantRegistrations(includeCancelled: true) {
        id
        createdAt
        status
        cancellationReason
        balance
        transactions {
          id
          status
          direction
          amount
          type
          subject
        }
        checkInTime
        didAttend
        submissions {
          id
          data
          submissionItem {
            id
            name
          }
        }
        user {
          id
          fullName
          firstName
          picture
          email
          phone
          university
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventForManagementGQL extends Apollo.Query<
  LoadEventForManagementQuery,
  LoadEventForManagementQueryVariables
> {
  override document = LoadEventForManagementDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RestorePaymentDocument = gql`
  mutation restorePayment($registrationId: ID!) {
    restorePayment(registrationId: $registrationId) {
      id
      participantRegistrations {
        id
        transactions {
          id
          status
          direction
          amount
          type
          subject
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RestorePaymentGQL extends Apollo.Mutation<
  RestorePaymentMutation,
  RestorePaymentMutationVariables
> {
  override document = RestorePaymentDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteRegistrationCodeDocument = gql`
  mutation deleteRegistrationCode($id: ID!) {
    deleteRegistrationCode(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteRegistrationCodeGQL extends Apollo.Mutation<
  DeleteRegistrationCodeMutation,
  DeleteRegistrationCodeMutationVariables
> {
  override document = DeleteRegistrationCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPhotosOfEventDocument = gql`
  query getPhotosOfEvent($eventId: ID!) {
    photos(eventId: $eventId) {
      id
      creator {
        id
        fullName
      }
      event {
        id
        title
      }
      cols
      rows
      src
      original
      originalBlob
      type
    }
    event(id: $eventId) {
      id
      title
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPhotosOfEventGQL extends Apollo.Query<
  GetPhotosOfEventQuery,
  GetPhotosOfEventQueryVariables
> {
  override document = GetPhotosOfEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPhotoShareKeyDocument = gql`
  query getPhotoShareKey {
    photoShareKey
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPhotoShareKeyGQL extends Apollo.Query<
  GetPhotoShareKeyQuery,
  GetPhotoShareKeyQueryVariables
> {
  override document = GetPhotoShareKeyDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreatePhotoShareDocument = gql`
  mutation createPhotoShare($data: CreatePhotoShareInput!, $eventId: ID!) {
    createPhotoShare(input: $data, eventId: $eventId) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreatePhotoShareGQL extends Apollo.Mutation<
  CreatePhotoShareMutation,
  CreatePhotoShareMutationVariables
> {
  override document = CreatePhotoShareDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadPublicRegistrationCodesDocument = gql`
  query loadPublicRegistrationCodes {
    eventRegistrationCodes(orderByEvent: true) {
      id
      targetEvent {
        id
        title
        icon
        start
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadPublicRegistrationCodesGQL extends Apollo.Query<
  LoadPublicRegistrationCodesQuery,
  LoadPublicRegistrationCodesQueryVariables
> {
  override document = LoadPublicRegistrationCodesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetHomePageDataDocument = gql`
  query getHomePageData {
    events(limit: 10) {
      id
      title
      icon
      start
    }
    currentUser {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetHomePageDataGQL extends Apollo.Query<
  GetHomePageDataQuery,
  GetHomePageDataQueryVariables
> {
  override document = GetHomePageDataDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetHomePageTenantInfoDocument = gql`
  query getHomePageTenantInfo {
    currentTenant {
      id
      shortName
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetHomePageTenantInfoGQL extends Apollo.Query<
  GetHomePageTenantInfoQuery,
  GetHomePageTenantInfoQueryVariables
> {
  override document = GetHomePageTenantInfoDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadPagesDocument = gql`
  query loadPages {
    currentTenant {
      id
      name
      imprintPage
      privacyPolicyPage
      faqPage
      aboutPage
      tacPage
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadPagesGQL extends Apollo.Query<
  LoadPagesQuery,
  LoadPagesQueryVariables
> {
  override document = LoadPagesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RegisterUserDocument = gql`
  mutation RegisterUser($userInput: CreateUserInput!) {
    createUser(input: $userInput) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RegisterUserGQL extends Apollo.Mutation<
  RegisterUserMutation,
  RegisterUserMutationVariables
> {
  override document = RegisterUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddEsnCardDocument = gql`
  mutation AddESNCard($esnCardNumber: String!) {
    addESNCard(esnCardNumber: $esnCardNumber) {
      id
      esnCardNumber
      esnCardValidUntil
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddEsnCardGQL extends Apollo.Mutation<
  AddEsnCardMutation,
  AddEsnCardMutationVariables
> {
  override document = AddEsnCardDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetProfileUploadKeyDocument = gql`
  query getProfileUploadKey {
    profileUploadKey
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetProfileUploadKeyGQL extends Apollo.Query<
  GetProfileUploadKeyQuery,
  GetProfileUploadKeyQueryVariables
> {
  override document = GetProfileUploadKeyDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateUserPictureDocument = gql`
  mutation updateUserPicture($userId: ID!, $file: String!) {
    updateUserPicture(userId: $userId, file: $file) {
      id
      picture
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateUserPictureGQL extends Apollo.Mutation<
  UpdateUserPictureMutation,
  UpdateUserPictureMutationVariables
> {
  override document = UpdateUserPictureDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPhotoJourneyDocument = gql`
  query getPhotoJourney {
    currentUser {
      eventRegistrations {
        id
        status
        event {
          id
          title
          icon
          location
          start
          photoShares {
            id
            type
            src
            original
            originalBlob
            container
            cols
            rows
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPhotoJourneyGQL extends Apollo.Query<
  GetPhotoJourneyQuery,
  GetPhotoJourneyQueryVariables
> {
  override document = GetPhotoJourneyDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UserProfileDocument = gql`
  query userProfile {
    currentUser {
      id
      fullName
      picture
      emailVerified
      email
      communicationEmail
      phone
      university
      iban
      paypal
      birthdate
      firstName
      lastName
      calendarToken
      esnCardNumber
      esnCardValidUntil
      enrolmentStatus
      bio
      country
      homeUniversity
      instagram
      position
      studyProgram
      currentTenant {
        userId
        tenantId
        status
      }
      organizedEventsCount
      createdEventsCount
    }
    currentTenant {
      settings {
        esnCardLink
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserProfileGQL extends Apollo.Query<
  UserProfileQuery,
  UserProfileQueryVariables
> {
  override document = UserProfileDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UserProfileEventsDocument = gql`
  query userProfileEvents {
    currentUser {
      id
      createdEvents {
        id
        title
        icon
        start
        end
        ratingPending
        participantRating
        participantRatingCount
      }
      organizedEvents(hideCancelled: true) {
        id
        title
        icon
        start
        end
        ratingPending
        userIsOrganizer
        participantRating
        participantRatingCount
      }
      participatedEvents(hideCancelled: true) {
        id
        title
        icon
        start
        end
        ratingPending
        userIsOrganizer
        participantRating
        participantRatingCount
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserProfileEventsGQL extends Apollo.Query<
  UserProfileEventsQuery,
  UserProfileEventsQueryVariables
> {
  override document = UserProfileEventsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UserProfilePublicDocument = gql`
  query userProfilePublic($id: ID!) {
    user(id: $id) {
      id
      firstName
      fullName
      picture
      university
      bio
      country
      homeUniversity
      instagram
      position
      studyProgram
      organizedEventsCount
      createdEventsCount
      currentTenant {
        userId
        tenantId
        status
      }
    }
    commonEvents(id: $id) {
      id
      title
      icon
      start
      end
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserProfilePublicGQL extends Apollo.Query<
  UserProfilePublicQuery,
  UserProfilePublicQueryVariables
> {
  override document = UserProfilePublicDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetRegistrationCodeInfoDocument = gql`
  query getRegistrationCodeInfo($code: ID!) {
    eventRegistrationCode(id: $code) {
      id
      status
      registrationCreated {
        id
        belongsToCurrentUser
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
            checkoutUrl
          }
        }
      }
      targetEvent {
        id
        registrationMode
        title
        start
        prices
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRegistrationCodeInfoGQL extends Apollo.Query<
  GetRegistrationCodeInfoQuery,
  GetRegistrationCodeInfoQueryVariables
> {
  override document = GetRegistrationCodeInfoDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SubmitEventFeedbackDocument = gql`
  mutation submitEventFeedback(
    $id: ID!
    $anonymousRating: Boolean!
    $rating: Int!
    $comment: String
  ) {
    rateEvent(
      id: $id
      anonymousRating: $anonymousRating
      rating: $rating
      comment: $comment
    ) {
      id
      ratingPending
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SubmitEventFeedbackGQL extends Apollo.Mutation<
  SubmitEventFeedbackMutation,
  SubmitEventFeedbackMutationVariables
> {
  override document = SubmitEventFeedbackDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UseRegistrationCodeDocument = gql`
  mutation useRegistrationCode($id: ID!, $price: JSON) {
    useRegistrationCode(id: $id, price: $price) {
      id
      status
      registrationCreated {
        id
        belongsToCurrentUser
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
            checkoutSession
          }
        }
      }
      targetEvent {
        id
        registrationMode
        title
        start
        prices
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UseRegistrationCodeGQL extends Apollo.Mutation<
  UseRegistrationCodeMutation,
  UseRegistrationCodeMutationVariables
> {
  override document = UseRegistrationCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateProfileDocument = gql`
  mutation updateProfile($input: UpdateUserInput!, $userId: ID!) {
    updateUser(input: $input, userId: $userId) {
      id
      firstName
      lastName
      fullName
      university
      bio
      country
      homeUniversity
      instagram
      studyProgram
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateProfileGQL extends Apollo.Mutation<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
> {
  override document = UpdateProfileDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateUserInformationDocument = gql`
  mutation updateUserInformation($input: UpdateUserInput!, $userId: ID!) {
    updateUser(input: $input, userId: $userId) {
      id
      phone
      enrolmentStatus
      communicationEmail
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateUserInformationGQL extends Apollo.Mutation<
  UpdateUserInformationMutation,
  UpdateUserInformationMutationVariables
> {
  override document = UpdateUserInformationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UserRolesDocument = gql`
  query userRoles {
    currentUser {
      id
      fullName
      esnCardValidUntil
      currentTenant {
        userId
        tenantId
        role
        status
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserRolesGQL extends Apollo.Query<
  UserRolesQuery,
  UserRolesQueryVariables
> {
  override document = UserRolesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateSubmissionItemDocument = gql`
  mutation createSubmissionItem(
    $target: String
    $id: ID!
    $input: CreateSubmissionItemInput!
  ) {
    createSubmissionItem(targetId: $id, input: $input, target: $target) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateSubmissionItemGQL extends Apollo.Mutation<
  CreateSubmissionItemMutation,
  CreateSubmissionItemMutationVariables
> {
  override document = CreateSubmissionItemDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteSubmissionItemDocument = gql`
  mutation deleteSubmissionItem($id: ID!) {
    deleteSubmissionItem(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteSubmissionItemGQL extends Apollo.Mutation<
  DeleteSubmissionItemMutation,
  DeleteSubmissionItemMutationVariables
> {
  override document = DeleteSubmissionItemDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SearchUserForTransactionDocument = gql`
  query SearchUserForTransaction($search: String) {
    users(search: $search, pageLength: 10) {
      id
      fullName
      email
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SearchUserForTransactionGQL extends Apollo.Query<
  SearchUserForTransactionQuery,
  SearchUserForTransactionQueryVariables
> {
  override document = SearchUserForTransactionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const TenantLoadEventsDocument = gql`
  query tenantLoadEvents($search: String, $before: DateTime, $after: DateTime) {
    events(search: $search, before: $before, after: $after) {
      id
      title
      description
      start
      end
      createdAt
      publicationState
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TenantLoadEventsGQL extends Apollo.Query<
  TenantLoadEventsQuery,
  TenantLoadEventsQueryVariables
> {
  override document = TenantLoadEventsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventCategoriesForAdminDocument = gql`
  query LoadEventCategoriesForAdmin {
    eventTemplateCategories {
      id
      name
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventCategoriesForAdminGQL extends Apollo.Query<
  LoadEventCategoriesForAdminQuery,
  LoadEventCategoriesForAdminQueryVariables
> {
  override document = LoadEventCategoriesForAdminDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateEventTemplateCategoryDocument = gql`
  mutation CreateEventTemplateCategory(
    $input: CreateEventTemplateCategoryInput!
  ) {
    createEventTemplateCategory(input: $input) {
      id
      name
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateEventTemplateCategoryGQL extends Apollo.Mutation<
  CreateEventTemplateCategoryMutation,
  CreateEventTemplateCategoryMutationVariables
> {
  override document = CreateEventTemplateCategoryDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteEventTemplateCategoryDocument = gql`
  mutation DeleteEventTemplateCategory($id: ID!) {
    deleteEventTemplateCategory(categoryId: $id) {
      id
      name
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteEventTemplateCategoryGQL extends Apollo.Mutation<
  DeleteEventTemplateCategoryMutation,
  DeleteEventTemplateCategoryMutationVariables
> {
  override document = DeleteEventTemplateCategoryDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetRegistrationsDocument = gql`
  query getRegistrations($pageLength: Int, $pageIndex: Int) {
    registrations(pageIndex: $pageIndex, pageLength: $pageLength) {
      id
      createdAt
      type
      balance
      event {
        title
        id
        icon
      }
      user {
        id
        fullName
        picture
        currentTenant {
          userId
          tenantId
          status
        }
      }
      transactions {
        id
        status
        direction
        amount
        type
        subject
        stripePayment {
          id
          status
          netAmount
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRegistrationsGQL extends Apollo.Query<
  GetRegistrationsQuery,
  GetRegistrationsQueryVariables
> {
  override document = GetRegistrationsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetRegistrationForAdminDocument = gql`
  query getRegistrationForAdmin($id: ID!) {
    registration(id: $id) {
      id
      createdAt
      type
      status
      cancellationReason
      event {
        title
        id
        start
        end
        icon
      }
      user {
        id
        fullName
        picture
        currentTenant {
          userId
          tenantId
          status
        }
      }
      transactions {
        id
        status
        direction
        amount
        type
        subject
        stripePayment {
          id
          status
          netAmount
          refundedAmount
          amount
          feeAmount
          paymentIntent
          paymentMethodType
          events
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRegistrationForAdminGQL extends Apollo.Query<
  GetRegistrationForAdminQuery,
  GetRegistrationForAdminQueryVariables
> {
  override document = GetRegistrationForAdminDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetRegistrationCountDocument = gql`
  query getRegistrationCount {
    registrationCount
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRegistrationCountGQL extends Apollo.Query<
  GetRegistrationCountQuery,
  GetRegistrationCountQueryVariables
> {
  override document = GetRegistrationCountDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCancelledRegistrationsDocument = gql`
  query getCancelledRegistrations {
    registrations(statusList: [CANCELLED]) {
      id
      createdAt
      cancellationReason
      event {
        title
        id
      }
      user {
        id
        fullName
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCancelledRegistrationsGQL extends Apollo.Query<
  GetCancelledRegistrationsQuery,
  GetCancelledRegistrationsQueryVariables
> {
  override document = GetCancelledRegistrationsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventRegistrationCodesDocument = gql`
  query getEventRegistrationCodes($pageLength: Int, $pageIndex: Int) {
    eventRegistrationCodes(
      pageIndex: $pageIndex
      pageLength: $pageLength
      includePrivate: true
      includePassed: true
      includeUsed: true
    ) {
      id
      createdAt
      isPublic
      status
      targetEvent {
        id
        title
        icon
      }
      creator {
        id
        fullName
        picture
        currentTenant {
          userId
          tenantId
          status
        }
      }
      registrationToRemove {
        id
      }
      registrationCreated {
        id
        createdAt
        user {
          id
          fullName
          picture
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventRegistrationCodesGQL extends Apollo.Query<
  GetEventRegistrationCodesQuery,
  GetEventRegistrationCodesQueryVariables
> {
  override document = GetEventRegistrationCodesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventRegistrationCodeDocument = gql`
  query getEventRegistrationCode($registrationId: ID!) {
    eventRegistrationCode(id: $registrationId) {
      id
      createdAt
      isPublic
      status
      sepaAllowed
      targetEvent {
        id
        title
        start
        end
        icon
      }
      creator {
        id
        email
        fullName
        picture
        currentTenant {
          userId
          tenantId
          status
        }
      }
      connectedRegistrations {
        id
        createdAt
        status
        cancellationReason
        user {
          id
          fullName
          picture
          currentTenant {
            userId
            tenantId
            status
          }
        }
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
            paymentMethodType
            paymentIntent
            events
          }
        }
      }
      registrationToRemove {
        id
        createdAt
        status
        cancellationReason
        user {
          id
          fullName
          picture
          currentTenant {
            userId
            tenantId
            status
          }
        }
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
            paymentMethodType
            paymentIntent
            events
          }
        }
      }
      registrationCreated {
        id
        createdAt
        status
        cancellationReason
        user {
          id
          fullName
          picture
          currentTenant {
            userId
            tenantId
            status
          }
        }
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
            paymentIntent
            paymentMethodType
            events
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventRegistrationCodeGQL extends Apollo.Query<
  GetEventRegistrationCodeQuery,
  GetEventRegistrationCodeQueryVariables
> {
  override document = GetEventRegistrationCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventRegistrationCodeCountDocument = gql`
  query getEventRegistrationCodeCount {
    eventRegistrationCodeCount
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventRegistrationCodeCountGQL extends Apollo.Query<
  GetEventRegistrationCodeCountQuery,
  GetEventRegistrationCodeCountQueryVariables
> {
  override document = GetEventRegistrationCodeCountDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadTransactionsDocument = gql`
  query loadTransactions(
    $range: DateRangeInput
    $search: String
    $directions: [TransactionDirection!]
    $types: [TransactionType!]
    $status: [TransactionStatus!]
    $take: Int
    $skip: Int
  ) {
    transactions(
      range: $range
      search: $search
      directions: $directions
      types: $types
      status: $status
      take: $take
      skip: $skip
    ) {
      id
      amount
      createdAt
      type
      subject
      status
      direction
      eventRegistration {
        id
        event {
          id
          title
        }
      }
      user {
        id
        fullName
      }
    }
    transactionCount(
      range: $range
      search: $search
      directions: $directions
      types: $types
      status: $status
    )
    transactionNetAmount(range: $range)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadTransactionsGQL extends Apollo.Query<
  LoadTransactionsQuery,
  LoadTransactionsQueryVariables
> {
  override document = LoadTransactionsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateOrganizerDocument = gql`
  mutation createOrganizer($input: NewOrganizerInput!) {
    createEventOrganizer(newOrganizerInput: $input) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateOrganizerGQL extends Apollo.Mutation<
  CreateOrganizerMutation,
  CreateOrganizerMutationVariables
> {
  override document = CreateOrganizerDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventsWithBookingDocument = gql`
  query loadEventsWithBooking($after: DateTime) {
    events(after: $after) {
      id
      title
      start
      icon
      registrationMode
      registrationStart
      participantLimit
      participantRegistrationCount
      countedParticipantRegistrations
      organizer {
        id
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventsWithBookingGQL extends Apollo.Query<
  LoadEventsWithBookingQuery,
  LoadEventsWithBookingQueryVariables
> {
  override document = LoadEventsWithBookingDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventsWithRatingDocument = gql`
  query loadEventsWithRating($after: DateTime) {
    events(after: $after, reverseOrder: true) {
      id
      title
      start
      icon
      participantRating
      participantRatingCount
      organizerRating
      organizerRatingCount
      ratings {
        userComment
        rating
        type
        anonymousRating
        user {
          id
          fullName
          picture
          currentTenant {
            userId
            tenantId
            status
          }
        }
      }
      organizer {
        id
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadEventsWithRatingGQL extends Apollo.Query<
  LoadEventsWithRatingQuery,
  LoadEventsWithRatingQueryVariables
> {
  override document = LoadEventsWithRatingDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadAllPhotosDocument = gql`
  query loadAllPhotos {
    photos {
      id
      cols
      rows
      src
      original
      originalBlob
      type
      event {
        id
        title
      }
      creator {
        id
        fullName
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadAllPhotosGQL extends Apollo.Query<
  LoadAllPhotosQuery,
  LoadAllPhotosQueryVariables
> {
  override document = LoadAllPhotosDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadUserDocument = gql`
  query loadUser($id: ID!) {
    user(id: $id) {
      id
      authId
      firstName
      lastName
      fullName
      email
      birthdate
      phone
      university
      esnCardValidUntil
      esnCardNumber
      position
      picture
      currentTenant(userId: $id) {
        userId
        tenantId
        role
        status
      }
      eventRegistrations {
        id
        createdAt
        checkInTime
        type
        status
        deletingCode {
          id
          createdAt
        }
        creatingCode {
          id
          createdAt
        }
        transactions {
          id
          status
          direction
          amount
          type
          subject
          stripePayment {
            id
            status
            events
          }
        }
        event {
          id
          title
          start
          end
          icon
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoadUserGQL extends Apollo.Query<
  LoadUserQuery,
  LoadUserQueryVariables
> {
  override document = LoadUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTenantForEditDocument = gql`
  query getTenantForEdit {
    currentTenant {
      id
      name
      imprintPage
      aboutPage
      privacyPolicyPage
      faqPage
      tacPage
      homePageLink
      homePageStrategy
      currency
      communicationEmail
      settings {
        socialLinks {
          label
          icon
          url
        }
        sectionHubLinks {
          label
          icon
          url
        }
        deRegistrationOptions {
          free {
            organizers {
              deRegistrationPossible
              minimumDaysForDeRegistration
              refundFeesOnDeRegistration
            }
            participants {
              deRegistrationPossible
              minimumDaysForDeRegistration
              refundFeesOnDeRegistration
              movePossible
              minimumDaysForMove
              refundFeesOnMove
            }
          }
          paid {
            organizers {
              deRegistrationPossible
              minimumDaysForDeRegistration
              refundFeesOnDeRegistration
            }
            participants {
              deRegistrationPossible
              minimumDaysForDeRegistration
              refundFeesOnDeRegistration
              movePossible
              minimumDaysForMove
              refundFeesOnMove
            }
          }
        }
        showPWAInstall
        brandIconUrl
        esnCardLink
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTenantForEditGQL extends Apollo.Query<
  GetTenantForEditQuery,
  GetTenantForEditQueryVariables
> {
  override document = GetTenantForEditDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOrganizersDocument = gql`
  query getOrganizers {
    eventOrganizers {
      id
      name
      text
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOrganizersGQL extends Apollo.Query<
  GetOrganizersQuery,
  GetOrganizersQueryVariables
> {
  override document = GetOrganizersDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetUsersDocument = gql`
  query getUsers(
    $roleList: [Role!]
    $statusList: [MembershipStatus!]
    $search: String
    $pageIndex: Int
    $pageLength: Int
    $emptyOnEmptySearch: Boolean
  ) {
    users(
      roleList: $roleList
      statusList: $statusList
      search: $search
      pageIndex: $pageIndex
      pageLength: $pageLength
      emptyOnEmptySearch: $emptyOnEmptySearch
    ) {
      id
      firstName
      lastName
      fullName
      email
      position
      picture
      currentTenant {
        userId
        tenantId
        role
        status
      }
    }
    userSearchResultNum(
      roleList: $roleList
      statusList: $statusList
      search: $search
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetUsersGQL extends Apollo.Query<
  GetUsersQuery,
  GetUsersQueryVariables
> {
  override document = GetUsersDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetStatisticsDocument = gql`
  query getStatistics($range: DateRangeInput, $tenantId: ID) {
    statistics(range: $range, tenantId: $tenantId) {
      usersRegistered
      registrations
      userHistory
      registrationHistory
      checkinHistory
      userEventDistribution
      usersRegisteredEvents
      usersRegisteredFreeEvents
      usersRegisteredPaidEvents
      checkins
      paidRegistrations
      totalEvents
      paidEvents
      userUniversityDistribution
      userStatusDistribution
      localStatusDistribution
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetStatisticsGQL extends Apollo.Query<
  GetStatisticsQuery,
  GetStatisticsQueryVariables
> {
  override document = GetStatisticsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateTenantDocument = gql`
  mutation updateTenant($id: ID!, $update: UpdateTenantInput!) {
    updateTenant(id: $id, updateTenantInput: $update) {
      id
      faqPage
      imprintPage
      privacyPolicyPage
      aboutPage
      tacPage
      homePageLink
      homePageStrategy
      currency
      communicationEmail
      settings {
        socialLinks {
          label
          icon
          url
        }
        sectionHubLinks {
          label
          icon
          url
        }
        brandIconUrl
        showPWAInstall
        esnCardLink
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateTenantGQL extends Apollo.Mutation<
  UpdateTenantMutation,
  UpdateTenantMutationVariables
> {
  override document = UpdateTenantDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateUserDocument = gql`
  mutation updateUser(
    $id: ID!
    $position: String
    $role: Role!
    $status: MembershipStatus!
  ) {
    updateUserPosition(userId: $id, position: $position) {
      position
    }
    updateUserRole(userId: $id, role: $role) {
      userId
      tenantId
      role
    }
    updateUserStatus(userId: $id, status: $status) {
      userId
      tenantId
      status
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateUserGQL extends Apollo.Mutation<
  UpdateUserMutation,
  UpdateUserMutationVariables
> {
  override document = UpdateUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTutorHubInfoDocument = gql`
  query getTutorHubInfo {
    currentTenant {
      id
      name
      tutorHub
      settings {
        sectionHubLinks {
          label
          icon
          url
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTutorHubInfoGQL extends Apollo.Query<
  GetTutorHubInfoQuery,
  GetTutorHubInfoQueryVariables
> {
  override document = GetTutorHubInfoDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTutorHubEventsDocument = gql`
  query getTutorHubEvents($range: DateRangeInput) {
    currentTenant {
      id
      tutorHubEvents(range: $range)
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTutorHubEventsGQL extends Apollo.Query<
  GetTutorHubEventsQuery,
  GetTutorHubEventsQueryVariables
> {
  override document = GetTutorHubEventsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
