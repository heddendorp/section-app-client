import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Decimal: any;
  JSON: any;
};

export type ActivityLog = {
  __typename?: 'ActivityLog';
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  involvedUser?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  oldData?: Maybe<Scalars['JSON']>;
  severity: Scalars['String'];
};

export type ActivityLogStat = {
  __typename?: 'ActivityLogStat';
  count: Scalars['Int'];
  message: Scalars['String'];
};

export type CostItem = {
  __typename?: 'CostItem';
  actualAmount?: Maybe<Scalars['Decimal']>;
  amount: Scalars['Decimal'];
  calculationInfo: Scalars['String'];
  complete: Scalars['Boolean'];
  confirmed: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  details?: Maybe<Scalars['String']>;
  event: TumiEvent;
  eventId: Scalars['ID'];
  id: Scalars['ID'];
  name: Scalars['String'];
  onInvoice: Scalars['Boolean'];
  receipts: Array<Receipt>;
  submittedAmount: Scalars['Decimal'];
  transactions: Array<Transaction>;
};

export type CreateEventFromTemplateInput = {
  end: Scalars['DateTime'];
  eventOrganizerId: Scalars['ID'];
  excludeFromRatings?: Scalars['Boolean'];
  excludeFromStatistics?: Scalars['Boolean'];
  organizerLimit: Scalars['Int'];
  participantLimit: Scalars['Int'];
  price?: InputMaybe<Scalars['Decimal']>;
  registrationLink?: InputMaybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  start: Scalars['DateTime'];
};

export type CreateEventTemplateCategoryInput = {
  icon: Scalars['String'];
  name: Scalars['String'];
};

export type CreateEventTemplateInput = {
  categoryId: Scalars['ID'];
  comment: Scalars['String'];
  coordinates: Scalars['JSON'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  googlePlaceId: Scalars['String'];
  googlePlaceUrl: Scalars['String'];
  icon: Scalars['String'];
  insuranceDescription: Scalars['String'];
  location: Scalars['String'];
  organizerText: Scalars['String'];
  participantText: Scalars['String'];
  shouldBeReportedToInsurance: Scalars['Boolean'];
  title: Scalars['String'];
};

export type CreatePhotoShareInput = {
  cols: Scalars['Int'];
  container: Scalars['String'];
  originalBlob: Scalars['String'];
  rows: Scalars['Int'];
  type: Scalars['String'];
};

export type CreateReceiptInput = {
  amount: Scalars['Decimal'];
  blob: Scalars['String'];
  container: Scalars['String'];
  costItemId: Scalars['ID'];
  md5: Scalars['String'];
  type: Scalars['String'];
};

export type CreateSubmissionItemInput = {
  data: Scalars['JSON'];
  instruction: Scalars['String'];
  name: Scalars['String'];
  required: Scalars['Boolean'];
  submissionTime: SubmissionTime;
  type: SubmissionItemType;
};

export type CreateUserInput = {
  birthdate: Scalars['DateTime'];
  enrolmentStatus: EnrolmentStatus;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  university: Scalars['String'];
};

export type Dcc = {
  __typename?: 'DCC';
  card?: Maybe<DccCard>;
  status: Scalars['String'];
};

export type DccCard = {
  __typename?: 'DCCCard';
  cert: Scalars['JSON'];
  format: Scalars['String'];
  name: Scalars['String'];
  pub_key: Scalars['String'];
  rawQR: Scalars['String'];
  recovery?: Maybe<Scalars['JSON']>;
  scanDate: Scalars['DateTime'];
  signature: Scalars['String'];
  test?: Maybe<Scalars['JSON']>;
  type: Scalars['String'];
  vaccination?: Maybe<Scalars['JSON']>;
  verified: Scalars['String'];
};

export type DateRangeInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
};

export enum EnrolmentStatus {
  Exchange = 'EXCHANGE',
  International = 'INTERNATIONAL',
  Local = 'LOCAL',
  None = 'NONE',
  Other = 'OTHER'
}

export type EventOrganizer = {
  __typename?: 'EventOrganizer';
  createdAt: Scalars['DateTime'];
  events: Array<TumiEvent>;
  id: Scalars['ID'];
  link?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  tenant: Tenant;
  tenantId: Scalars['ID'];
  text: Scalars['String'];
};

export type EventRegistration = {
  __typename?: 'EventRegistration';
  belongsToCurrentUser: Scalars['Boolean'];
  cancellationReason?: Maybe<Scalars['String']>;
  checkInTime?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  creatingCode?: Maybe<EventRegistrationCode>;
  deletingCode?: Maybe<EventRegistrationCode>;
  didAttend: Scalars['Boolean'];
  event: TumiEvent;
  eventId: Scalars['ID'];
  id: Scalars['ID'];
  manualCheckin: Scalars['Boolean'];
  rating?: Maybe<Scalars['Int']>;
  status: RegistrationStatus;
  submissions: Array<EventSubmission>;
  transaction?: Maybe<Transaction>;
  transactionId?: Maybe<Scalars['ID']>;
  type: RegistrationType;
  user: User;
  userComment?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type EventRegistrationCode = {
  __typename?: 'EventRegistrationCode';
  connectedRegistrations: Array<EventRegistration>;
  createdAt: Scalars['DateTime'];
  createdById: Scalars['ID'];
  creator: User;
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  registrationCreated?: Maybe<EventRegistration>;
  registrationCreatedId?: Maybe<Scalars['ID']>;
  registrationToRemove?: Maybe<EventRegistration>;
  registrationToRemoveId?: Maybe<Scalars['ID']>;
  sepaAllowed: Scalars['Boolean'];
  status: RegistrationStatus;
  targetEvent: TumiEvent;
  targetEventId: Scalars['ID'];
  transaction: Transaction;
  transactionId?: Maybe<Scalars['ID']>;
};

export type EventSubmission = {
  __typename?: 'EventSubmission';
  createdAt: Scalars['DateTime'];
  data: Scalars['JSON'];
  id: Scalars['ID'];
  registration: EventRegistration;
  registrationId?: Maybe<Scalars['ID']>;
  submissionItem: EventSubmissionItem;
  submissionItemId: Scalars['ID'];
};

export type EventSubmissionItem = {
  __typename?: 'EventSubmissionItem';
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['JSON']>;
  event: TumiEvent;
  eventId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  instruction: Scalars['String'];
  name: Scalars['String'];
  ownSubmissions: Array<EventSubmission>;
  required: Scalars['Boolean'];
  responses: Scalars['JSON'];
  submissionTime: SubmissionTime;
  submissions: Array<EventSubmission>;
  type: Scalars['String'];
};


export type EventSubmissionItemOwnSubmissionsArgs = {
  onlyOwn?: InputMaybe<Scalars['Boolean']>;
};


export type EventSubmissionItemResponsesArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']>;
};

export type EventTemplate = {
  __typename?: 'EventTemplate';
  category?: Maybe<EventTemplateCategory>;
  comment: Scalars['String'];
  coordinates?: Maybe<Scalars['JSON']>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  eventInstanceCount: Scalars['Int'];
  eventInstances: Array<TumiEvent>;
  finances: Scalars['JSON'];
  googlePlaceId?: Maybe<Scalars['String']>;
  googlePlaceUrl?: Maybe<Scalars['String']>;
  icon: Scalars['String'];
  id: Scalars['ID'];
  insuranceDescription: Scalars['String'];
  location: Scalars['String'];
  organizerText: Scalars['String'];
  participantRating?: Maybe<Scalars['Float']>;
  participantRatingCount?: Maybe<Scalars['Int']>;
  participantText: Scalars['String'];
  shouldBeReportedToInsurance: Scalars['Boolean'];
  tenant: Tenant;
  title: Scalars['String'];
};

export type EventTemplateCategory = {
  __typename?: 'EventTemplateCategory';
  createdAt: Scalars['DateTime'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  templateCount: Scalars['Int'];
  templates: Array<EventTemplate>;
  tenant: Tenant;
  tenantId: Scalars['ID'];
};

export type LineItem = {
  __typename?: 'LineItem';
  cancellationReason?: Maybe<Scalars['String']>;
  cart: ShoppingCart;
  cost: Scalars['Decimal'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  pickupTime?: Maybe<Scalars['DateTime']>;
  product: Product;
  productId: Scalars['ID'];
  purchase: Purchase;
  purchaseId?: Maybe<Scalars['ID']>;
  quantity: Scalars['Int'];
  shoppingCartId?: Maybe<Scalars['ID']>;
  submissions: Array<EventSubmission>;
};

export enum LogSeverity {
  Debug = 'DEBUG',
  Error = 'ERROR',
  Info = 'INFO',
  Silly = 'SILLY',
  Warning = 'WARNING'
}

export enum MembershipStatus {
  Alumni = 'ALUMNI',
  Full = 'FULL',
  None = 'NONE',
  Sponsor = 'SPONSOR',
  Trial = 'TRIAL'
}

export type Mutation = {
  __typename?: 'Mutation';
  addOrganizerToEvent: TumiEvent;
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
  createUser: User;
  deleteCostItem: CostItem;
  deleteEvent: TumiEvent;
  deleteEventTemplateCategory: EventTemplateCategory;
  deleteReceipt: Receipt;
  deleteSubmissionItem: EventSubmissionItem;
  deleteTemplate: EventTemplate;
  deregisterFromEvent: TumiEvent;
  rateEvent: TumiEvent;
  registerForEvent: TumiEvent;
  updateCostItemsFromTemplate: TumiEvent;
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
  updateUserRole: UsersOfTenants;
  updateUserStatus: UsersOfTenants;
  useRegistrationCode: EventRegistrationCode;
  verifyDCC: Dcc;
};


export type MutationAddOrganizerToEventArgs = {
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationChangeEventPublicationArgs = {
  eventId: Scalars['ID'];
  publicationState: PublicationState;
};


export type MutationCheckInUserArgs = {
  manualCheckin?: InputMaybe<Scalars['Boolean']>;
  registrationId: Scalars['ID'];
};


export type MutationCreateEventFromTemplateArgs = {
  input: CreateEventFromTemplateInput;
  templateId: Scalars['ID'];
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
  eventId: Scalars['ID'];
  input: CreatePhotoShareInput;
};


export type MutationCreateReceiptArgs = {
  costItemId: Scalars['ID'];
  input: CreateReceiptInput;
};


export type MutationCreateRegistrationCodeArgs = {
  eventId: Scalars['ID'];
  isPublic?: InputMaybe<Scalars['Boolean']>;
  registrationId?: InputMaybe<Scalars['ID']>;
  sepaAllowed?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateSubmissionItemArgs = {
  input: CreateSubmissionItemInput;
  target?: InputMaybe<Scalars['String']>;
  targetId: Scalars['ID'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteCostItemArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEventTemplateCategoryArgs = {
  categoryId: Scalars['ID'];
};


export type MutationDeleteReceiptArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubmissionItemArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTemplateArgs = {
  templateId: Scalars['ID'];
};


export type MutationDeregisterFromEventArgs = {
  registrationId: Scalars['ID'];
  withRefund?: InputMaybe<Scalars['Boolean']>;
};


export type MutationRateEventArgs = {
  comment?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  rating: Scalars['Int'];
};


export type MutationRegisterForEventArgs = {
  eventId: Scalars['ID'];
  price?: InputMaybe<Scalars['JSON']>;
  registrationType?: InputMaybe<RegistrationType>;
  submissions?: InputMaybe<Scalars['JSON']>;
};


export type MutationUpdateCostItemsFromTemplateArgs = {
  eventId: Scalars['ID'];
};


export type MutationUpdateEsnCardArgs = {
  esnCardOverride: Scalars['Boolean'];
  id: Scalars['ID'];
};


export type MutationUpdateEventCoreInfoArgs = {
  eventId: Scalars['ID'];
  input: UpdateCoreEventInput;
};


export type MutationUpdateEventGeneralInfoArgs = {
  eventId: Scalars['ID'];
  input: UpdateGeneralEventInput;
};


export type MutationUpdateEventLocationArgs = {
  eventId: Scalars['ID'];
  input: UpdateEventLocationInput;
};


export type MutationUpdateEventTemplateConnectionArgs = {
  eventId: Scalars['ID'];
  templateId: Scalars['ID'];
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
  templateId: Scalars['ID'];
};


export type MutationUpdateTemplateCategoryArgs = {
  categoryId: Scalars['ID'];
  templateId: Scalars['ID'];
};


export type MutationUpdateTemplateFinancesArgs = {
  finances: Scalars['JSON'];
  templateId: Scalars['ID'];
};


export type MutationUpdateTemplateLocationArgs = {
  location: UpdateTemplateLocationInput;
  templateId: Scalars['ID'];
};


export type MutationUpdateTenantArgs = {
  id: Scalars['ID'];
  updateTenantInput: UpdateTenantInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  userId: Scalars['ID'];
};


export type MutationUpdateUserRoleArgs = {
  role: Role;
  userId: Scalars['ID'];
};


export type MutationUpdateUserStatusArgs = {
  status: MembershipStatus;
  userId: Scalars['ID'];
};


export type MutationUseRegistrationCodeArgs = {
  id: Scalars['ID'];
  price?: InputMaybe<Scalars['JSON']>;
};


export type MutationVerifyDccArgs = {
  certificate: Scalars['String'];
};

export type NewOrganizerInput = {
  link?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  text: Scalars['String'];
};

export type PhotoShare = {
  __typename?: 'PhotoShare';
  cols: Scalars['Int'];
  container: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['ID'];
  event: TumiEvent;
  eventId: Scalars['ID'];
  id: Scalars['ID'];
  original: Scalars['String'];
  originalBlob: Scalars['String'];
  previewBlob?: Maybe<Scalars['String']>;
  rows: Scalars['Int'];
  src: Scalars['String'];
  type: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  availability: Array<MembershipStatus>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  images: Array<ProductImage>;
  isActive: Scalars['Boolean'];
  isESNcard: Scalars['Boolean'];
  leadImage: ProductImage;
  leadImageId?: Maybe<Scalars['ID']>;
  lineItems: Array<LineItem>;
  needsShippingAddress: Scalars['Boolean'];
  prices: Scalars['JSON'];
  publicationState: PublicationState;
  tenant: Tenant;
  tenantId: Scalars['ID'];
  title: Scalars['String'];
};


export type ProductLineItemsArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  container: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['ID'];
  id: Scalars['ID'];
  original: Scalars['String'];
  originalBlob: Scalars['String'];
  previewBlob?: Maybe<Scalars['String']>;
  product: Product;
  productId: Scalars['ID'];
  src: Scalars['String'];
};

export enum PublicationState {
  Approval = 'APPROVAL',
  Draft = 'DRAFT',
  Organizers = 'ORGANIZERS',
  Public = 'PUBLIC'
}

export type Purchase = {
  __typename?: 'Purchase';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  items: Array<LineItem>;
  status: PurchaseStatus;
  transaction: Transaction;
  transactionId: Scalars['ID'];
  user: User;
  userId: Scalars['ID'];
};

export enum PurchaseStatus {
  Cancelled = 'CANCELLED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Sent = 'SENT'
}

export type Query = {
  __typename?: 'Query';
  blobUploadKey: Scalars['String'];
  costItem: CostItem;
  costItems: Array<CostItem>;
  currentTenant: Tenant;
  currentUser?: Maybe<User>;
  event: TumiEvent;
  eventOrganizers: Array<EventOrganizer>;
  eventRegistrationCode: EventRegistrationCode;
  eventRegistrationCodes: Array<EventRegistrationCode>;
  eventTemplate: EventTemplate;
  eventTemplateCategories: Array<EventTemplateCategory>;
  eventTemplates: Array<EventTemplate>;
  events: Array<TumiEvent>;
  logStats: Array<ActivityLogStat>;
  logs: Array<ActivityLog>;
  photoShareKey: Scalars['String'];
  photos: Array<PhotoShare>;
  purchase: Purchase;
  purchases: Array<Purchase>;
  registration: EventRegistration;
  registrationCount: Scalars['Int'];
  registrations: Array<EventRegistration>;
  statistics: Statistics;
  tenants: Array<Tenant>;
  transactionCount: Scalars['Int'];
  transactionSumAmount: Scalars['Float'];
  transactions: Array<Transaction>;
  user: User;
  userSearchResultNum: Scalars['Int'];
  users: Array<User>;
};


export type QueryCostItemArgs = {
  id: Scalars['ID'];
};


export type QueryCostItemsArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryEventRegistrationCodeArgs = {
  id: Scalars['ID'];
};


export type QueryEventRegistrationCodesArgs = {
  includePassed?: InputMaybe<Scalars['Boolean']>;
  includePrivate?: InputMaybe<Scalars['Boolean']>;
  includeUsed?: InputMaybe<Scalars['Boolean']>;
  orderByEvent?: InputMaybe<Scalars['Boolean']>;
};


export type QueryEventTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryEventTemplatesArgs = {
  onlyWithoutCategory?: InputMaybe<Scalars['Boolean']>;
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['DateTime']>;
  before?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryPhotosArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
};


export type QueryPurchaseArgs = {
  id: Scalars['ID'];
};


export type QueryPurchasesArgs = {
  limitToOwn?: InputMaybe<Scalars['Boolean']>;
};


export type QueryRegistrationArgs = {
  id: Scalars['ID'];
};


export type QueryRegistrationCountArgs = {
  statusList?: InputMaybe<Array<RegistrationStatus>>;
};


export type QueryRegistrationsArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageLength?: InputMaybe<Scalars['Int']>;
  statusList?: InputMaybe<Array<RegistrationStatus>>;
};


export type QueryStatisticsArgs = {
  range?: InputMaybe<DateRangeInput>;
  tenantId?: InputMaybe<Scalars['ID']>;
};


export type QueryTransactionCountArgs = {
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
};


export type QueryTransactionSumAmountArgs = {
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
};


export type QueryTransactionsArgs = {
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserSearchResultNumArgs = {
  roleList?: InputMaybe<Array<Role>>;
  search?: InputMaybe<Scalars['String']>;
  statusList?: InputMaybe<Array<MembershipStatus>>;
};


export type QueryUsersArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']>;
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageLength?: InputMaybe<Scalars['Int']>;
  roleList?: InputMaybe<Array<Role>>;
  search?: InputMaybe<Scalars['String']>;
  statusList?: InputMaybe<Array<MembershipStatus>>;
};

export type Receipt = {
  __typename?: 'Receipt';
  amount: Scalars['Decimal'];
  blob: Scalars['String'];
  container: Scalars['String'];
  costItem: CostItem;
  costItemId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  md5?: Maybe<Scalars['String']>;
  originalUrl: Scalars['String'];
  preview?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  user: User;
  userId: Scalars['ID'];
};

export enum RegistrationMode {
  External = 'EXTERNAL',
  Online = 'ONLINE',
  Stripe = 'STRIPE'
}

export enum RegistrationStatus {
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL'
}

export enum RegistrationType {
  Calendar = 'CALENDAR',
  Organizer = 'ORGANIZER',
  Participant = 'PARTICIPANT'
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type ShoppingCart = {
  __typename?: 'ShoppingCart';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  items: Array<LineItem>;
  userOfTenant: UsersOfTenants;
  usersOfTenantsTenantId: Scalars['ID'];
  usersOfTenantsUserId: Scalars['ID'];
};

export type Statistics = {
  __typename?: 'Statistics';
  checkinHistory: Scalars['JSON'];
  checkins: Scalars['Int'];
  paidEvents: Scalars['Int'];
  paidRegistrations: Scalars['Int'];
  registrationHistory: Scalars['JSON'];
  registrations: Scalars['Int'];
  totalEvents: Scalars['Int'];
  userEventDistribution: Scalars['JSON'];
  userHistory: Scalars['JSON'];
  userStatusDistribution: Scalars['JSON'];
  userUniversityDistribution: Scalars['JSON'];
  usersRegistered: Scalars['Int'];
  usersRegisteredEvents: Scalars['Int'];
  usersRegisteredFreeEvents: Scalars['Int'];
  usersRegisteredPaidEvents: Scalars['Int'];
  usersWithCustomer: Scalars['Int'];
  usersWithPaymentMethod: Scalars['Int'];
};

export type StripePayment = {
  __typename?: 'StripePayment';
  amount: Scalars['Decimal'];
  checkoutSession: Scalars['String'];
  createdAt: Scalars['DateTime'];
  events: Scalars['JSON'];
  feeAmount?: Maybe<Scalars['Decimal']>;
  id: Scalars['ID'];
  netAmount?: Maybe<Scalars['Decimal']>;
  netLessRefundAmount: Scalars['Decimal'];
  paymentIntent: Scalars['String'];
  paymentMethod?: Maybe<Scalars['String']>;
  paymentMethodType?: Maybe<Scalars['String']>;
  refundedAmount?: Maybe<Scalars['Decimal']>;
  shipping?: Maybe<Scalars['JSON']>;
  status: Scalars['String'];
  transaction: Transaction;
  transactionId: Scalars['ID'];
};

export type StripeUserData = {
  __typename?: 'StripeUserData';
  customerId: Scalars['String'];
  id: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['String']>;
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
  Text = 'TEXT'
}

export enum SubmissionTime {
  After = 'AFTER',
  Before = 'BEFORE',
  During = 'DURING',
  Registration = 'REGISTRATION'
}

export type Tenant = {
  __typename?: 'Tenant';
  aboutPage: Scalars['String'];
  createdAt: Scalars['DateTime'];
  faqPage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imprintPage: Scalars['String'];
  name: Scalars['String'];
  organizers: Array<EventOrganizer>;
  privacyPolicyPage: Scalars['String'];
  shortName: Scalars['String'];
  tacPage?: Maybe<Scalars['String']>;
  users: Array<UsersOfTenants>;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Decimal'];
  comment?: Maybe<Scalars['String']>;
  costItem: CostItem;
  costItemId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['DateTime'];
  createdBy: User;
  creatorId?: Maybe<Scalars['ID']>;
  eventRegistration?: Maybe<EventRegistration>;
  id: Scalars['ID'];
  isMembershipFee: Scalars['Boolean'];
  partner?: Maybe<Scalars['String']>;
  purchase: Purchase;
  stripePayment: StripePayment;
  subject: Scalars['String'];
  tenant: Tenant;
  tenantId: Scalars['ID'];
  type: Scalars['String'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']>;
};

export enum TransactionType {
  Cash = 'CASH',
  Paypal = 'PAYPAL',
  Stripe = 'STRIPE',
  Transfer = 'TRANSFER'
}

export type TumiEvent = {
  __typename?: 'TumiEvent';
  activeRegistration?: Maybe<EventRegistration>;
  amountCollected: Scalars['Decimal'];
  coordinates?: Maybe<Scalars['JSON']>;
  costItems: Array<CostItem>;
  couldBeOrganizer: Scalars['Boolean'];
  couldBeParticipant: Scalars['Boolean'];
  countedParticipantRegistrations: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  createdBy: User;
  creatorId: Scalars['ID'];
  description: Scalars['String'];
  disableDeregistration: Scalars['Boolean'];
  end: Scalars['DateTime'];
  eventOrganizerId: Scalars['ID'];
  eventRegistrationCodes: Array<EventRegistrationCode>;
  eventTemplate: EventTemplate;
  eventTemplateId: Scalars['ID'];
  excludeFromRatings: Scalars['Boolean'];
  excludeFromStatistics: Scalars['Boolean'];
  feesPaid: Scalars['Decimal'];
  freeParticipantSpots: Scalars['String'];
  googlePlaceId?: Maybe<Scalars['String']>;
  googlePlaceUrl?: Maybe<Scalars['String']>;
  icon: Scalars['String'];
  id: Scalars['ID'];
  insuranceDescription: Scalars['String'];
  location: Scalars['String'];
  needsRating: Scalars['Boolean'];
  netAmountCollected: Scalars['Decimal'];
  organizer: EventOrganizer;
  organizerLimit: Scalars['Int'];
  organizerRatings?: Maybe<Scalars['Float']>;
  organizerRegistrationPossible: Scalars['Boolean'];
  organizerRegistrations: Array<EventRegistration>;
  organizerSignup: Array<Scalars['String']>;
  organizerText: Scalars['String'];
  organizers: Array<User>;
  organizersRegistered: Scalars['Int'];
  ownRegistrations: Array<EventRegistration>;
  participantLimit: Scalars['Int'];
  participantRatings?: Maybe<Scalars['Float']>;
  participantRegistrationCount: Scalars['Int'];
  participantRegistrationPossible: Scalars['JSON'];
  participantRegistrations: Array<EventRegistration>;
  participantSignup: Array<Scalars['String']>;
  participantText: Scalars['String'];
  participantsAttended: Scalars['Int'];
  photoShares: Array<PhotoShare>;
  plannedSpend: Scalars['Decimal'];
  prices?: Maybe<Scalars['JSON']>;
  publicationState: PublicationState;
  refundFeesPaid: Scalars['Decimal'];
  registrationLink?: Maybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  registrationStart: Scalars['DateTime'];
  shouldBeReportedToInsurance: Scalars['Boolean'];
  start: Scalars['DateTime'];
  submissionItems: Array<EventSubmissionItem>;
  submittedSpend: Scalars['Decimal'];
  title: Scalars['String'];
  userIsCreator: Scalars['Boolean'];
  userIsOrganizer: Scalars['Boolean'];
  userIsRegistered: Scalars['Boolean'];
};


export type TumiEventCostItemsArgs = {
  hideOnInvoice?: InputMaybe<Scalars['Boolean']>;
};


export type TumiEventOwnRegistrationsArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']>;
};


export type TumiEventParticipantRegistrationsArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']>;
};


export type TumiEventSubmissionItemsArgs = {
  submissionTime?: InputMaybe<SubmissionTime>;
};

export type UpdateCoreEventInput = {
  disableDeregistration?: InputMaybe<Scalars['Boolean']>;
  end?: InputMaybe<Scalars['DateTime']>;
  eventOrganizerId: Scalars['ID'];
  excludeFromRatings?: InputMaybe<Scalars['Boolean']>;
  excludeFromStatistics?: InputMaybe<Scalars['Boolean']>;
  icon?: InputMaybe<Scalars['String']>;
  insuranceDescription?: InputMaybe<Scalars['String']>;
  organizerLimit?: InputMaybe<Scalars['Int']>;
  organizerSignup?: InputMaybe<Array<MembershipStatus>>;
  participantLimit?: InputMaybe<Scalars['Int']>;
  participantSignup?: InputMaybe<Array<MembershipStatus>>;
  prices?: InputMaybe<Scalars['JSON']>;
  registrationLink?: InputMaybe<Scalars['String']>;
  registrationMode?: InputMaybe<RegistrationMode>;
  registrationStart?: InputMaybe<Scalars['DateTime']>;
  shouldBeReportedToInsurance?: InputMaybe<Scalars['Boolean']>;
  start?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateEventLocationInput = {
  coordinates?: InputMaybe<Scalars['JSON']>;
  googlePlaceId?: InputMaybe<Scalars['String']>;
  googlePlaceUrl?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
};

export type UpdateGeneralEventInput = {
  description?: InputMaybe<Scalars['String']>;
  organizerText?: InputMaybe<Scalars['String']>;
  participantText?: InputMaybe<Scalars['String']>;
};

export type UpdateTemplateInput = {
  comment?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['Decimal']>;
  icon?: InputMaybe<Scalars['String']>;
  insuranceDescription?: InputMaybe<Scalars['String']>;
  organizerText?: InputMaybe<Scalars['String']>;
  participantText?: InputMaybe<Scalars['String']>;
  shouldBeReportedToInsurance?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateTemplateLocationInput = {
  coordinates?: InputMaybe<Scalars['JSON']>;
  googlePlaceId?: InputMaybe<Scalars['String']>;
  googlePlaceUrl?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
};

export type UpdateTenantInput = {
  aboutPage?: InputMaybe<Scalars['String']>;
  faqPage?: InputMaybe<Scalars['String']>;
  imprintPage?: InputMaybe<Scalars['String']>;
  privacyPolicyPage?: InputMaybe<Scalars['String']>;
  tacPage?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  birthdate?: InputMaybe<Scalars['DateTime']>;
  enrolmentStatus?: InputMaybe<EnrolmentStatus>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  university?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  authId: Scalars['String'];
  birthdate?: Maybe<Scalars['DateTime']>;
  calendarToken: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdTransactions: Array<Transaction>;
  currentTenant?: Maybe<UsersOfTenants>;
  email: Scalars['String'];
  emailVerified: Scalars['Boolean'];
  enrolmentStatus: EnrolmentStatus;
  esnCardOverride: Scalars['Boolean'];
  eventRegistrations: Array<EventRegistration>;
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  hasESNCard: Scalars['Boolean'];
  hasEsnCard: Scalars['Boolean'];
  iban?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  organizedEvents: Array<TumiEvent>;
  outstandingRating: Scalars['Boolean'];
  participatedEvents: Array<TumiEvent>;
  paypal?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  picture: Scalars['String'];
  profileComplete: Scalars['Boolean'];
  purchases: Array<Purchase>;
  transactions: Array<Transaction>;
  university?: Maybe<Scalars['String']>;
};


export type UserCurrentTenantArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};


export type UserOrganizedEventsArgs = {
  hideCancelled?: InputMaybe<Scalars['Boolean']>;
};


export type UserParticipatedEventsArgs = {
  hideCancelled?: InputMaybe<Scalars['Boolean']>;
};


export type UserPurchasesArgs = {
  skipCancelled?: InputMaybe<Scalars['Boolean']>;
};

export type UsersOfTenants = {
  __typename?: 'UsersOfTenants';
  cart: ShoppingCart;
  createdAt: Scalars['DateTime'];
  role: Role;
  status: MembershipStatus;
  stripeData?: Maybe<StripeUserData>;
  tenant: Tenant;
  tenantId: Scalars['ID'];
  user: User;
  userId: Scalars['ID'];
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, profileComplete: boolean, firstName: string, lastName: string, email: string, phone?: string | null, picture: string, university?: string | null, enrolmentStatus: EnrolmentStatus, birthdate?: any | null } | null };

export type GetTenantInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantInfoQuery = { __typename?: 'Query', currentTenant: { __typename?: 'Tenant', id: string, name: string, faqPage?: string | null }, currentUser?: { __typename?: 'User', id: string, outstandingRating: boolean } | null };

export type CreateEventTemplateMutationVariables = Exact<{
  input: CreateEventTemplateInput;
}>;


export type CreateEventTemplateMutation = { __typename?: 'Mutation', createEventTemplate: { __typename?: 'EventTemplate', id: string, createdAt: any } };

export type CreateEventFromTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
  eventData: CreateEventFromTemplateInput;
}>;


export type CreateEventFromTemplateMutation = { __typename?: 'Mutation', createEventFromTemplate: { __typename?: 'TumiEvent', id: string } };

export type UpdateTemplateLocationMutationVariables = Exact<{
  templateId: Scalars['ID'];
  update: UpdateTemplateLocationInput;
}>;


export type UpdateTemplateLocationMutation = { __typename?: 'Mutation', updateTemplateLocation: { __typename?: 'EventTemplate', id: string, location: string, coordinates?: any | null, googlePlaceUrl?: string | null } };

export type UpdateEventTemplateCategoryAssignmentMutationVariables = Exact<{
  templateId: Scalars['ID'];
  categoryId: Scalars['ID'];
}>;


export type UpdateEventTemplateCategoryAssignmentMutation = { __typename?: 'Mutation', updateTemplateCategory: { __typename?: 'EventTemplate', id: string, category?: { __typename?: 'EventTemplateCategory', id: string, name: string } | null } };

export type UpdateEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
  update: UpdateTemplateInput;
}>;


export type UpdateEventTemplateMutation = { __typename?: 'Mutation', updateTemplate: { __typename?: 'EventTemplate', id: string, title: string, icon: string, duration: any, description: string, organizerText: string, participantText: string, comment: string, location: string, coordinates?: any | null, insuranceDescription: string, shouldBeReportedToInsurance: boolean } };

export type DeleteEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
}>;


export type DeleteEventTemplateMutation = { __typename?: 'Mutation', deleteTemplate: { __typename?: 'EventTemplate', id: string } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate: { __typename?: 'EventTemplate', id: string } };

export type GetEventTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventTemplatesQuery = { __typename?: 'Query', eventTemplates: Array<{ __typename?: 'EventTemplate', id: string, title: string, icon: string }> };

export type GetTemplateCategoriesWithTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTemplateCategoriesWithTemplatesQuery = { __typename?: 'Query', eventTemplateCategories: Array<{ __typename?: 'EventTemplateCategory', id: string, name: string, icon: string, templateCount: number, templates: Array<{ __typename?: 'EventTemplate', id: string, title: string, icon: string, participantRating?: number | null, participantRatingCount?: number | null, eventInstanceCount: number }> }> };

export type GetEventTemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventTemplateCategoriesQuery = { __typename?: 'Query', eventTemplateCategories: Array<{ __typename?: 'EventTemplateCategory', id: string, name: string, icon: string }> };

export type GetLonelyEventTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLonelyEventTemplatesQuery = { __typename?: 'Query', eventTemplates: Array<{ __typename?: 'EventTemplate', id: string, title: string, icon: string, participantRating?: number | null, participantRatingCount?: number | null }> };

export type GetEventTemplateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetEventTemplateQuery = { __typename?: 'Query', eventTemplate: { __typename?: 'EventTemplate', id: string, title: string, icon: string, duration: any, description: string, organizerText: string, participantText: string, comment: string, location: string, coordinates?: any | null, googlePlaceUrl?: string | null, finances: any, insuranceDescription: string, shouldBeReportedToInsurance: boolean, category?: { __typename?: 'EventTemplateCategory', id: string, name: string, icon: string } | null, eventInstances: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any }> } };

export type UpdateFinancesMutationVariables = Exact<{
  id: Scalars['ID'];
  finances: Scalars['JSON'];
}>;


export type UpdateFinancesMutation = { __typename?: 'Mutation', updateTemplateFinances: { __typename?: 'EventTemplate', id: string, finances: any } };

export type GetOrganizerOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizerOptionsQuery = { __typename?: 'Query', eventOrganizers: Array<{ __typename?: 'EventOrganizer', id: string, name: string }> };

export type GetCostItemsForEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GetCostItemsForEventQuery = { __typename?: 'Query', costItems: Array<{ __typename?: 'CostItem', id: string, name: string, calculationInfo: string, amount: any, onInvoice: boolean, submittedAmount: any }>, event: { __typename?: 'TumiEvent', id: string, eventTemplate: { __typename?: 'EventTemplate', id: string, finances: any } } };

export type UpdateCostItemsFromTemplateMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type UpdateCostItemsFromTemplateMutation = { __typename?: 'Mutation', updateCostItemsFromTemplate: { __typename?: 'TumiEvent', id: string, costItems: Array<{ __typename?: 'CostItem', id: string, name: string, calculationInfo: string, amount: any, onInvoice: boolean }> } };

export type RegisterForEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  type?: InputMaybe<RegistrationType>;
  submissions?: InputMaybe<Scalars['JSON']>;
  price?: InputMaybe<Scalars['JSON']>;
}>;


export type RegisterForEventMutation = { __typename?: 'Mutation', registerForEvent: { __typename?: 'TumiEvent', id: string, organizerRegistrationPossible: boolean, participantRegistrationPossible: any, organizersRegistered: number, participantRegistrationCount: number, couldBeOrganizer: boolean, userIsRegistered: boolean, activeRegistration?: { __typename?: 'EventRegistration', id: string, type: RegistrationType, status: RegistrationStatus, cancellationReason?: string | null, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, createdAt: any, amount: any, status: string, checkoutSession: string, paymentIntent: string } } | null } | null, organizers: Array<{ __typename?: 'User', fullName: string }> } };

export type LoadEventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, hasESNCard: boolean, university?: string | null } | null, event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, registrationStart: any, disableDeregistration: boolean, publicationState: PublicationState, description: string, organizerText: string, organizerLimit: number, participantText: string, registrationMode: RegistrationMode, registrationLink?: string | null, freeParticipantSpots: string, prices?: any | null, location: string, coordinates?: any | null, googlePlaceUrl?: string | null, organizerSignup: Array<string>, participantSignup: Array<string>, organizerRegistrationPossible: boolean, participantRegistrationPossible: any, userIsRegistered: boolean, userIsOrganizer: boolean, userIsCreator: boolean, participantLimit: number, participantRegistrationCount: number, couldBeOrganizer: boolean, couldBeParticipant: boolean, createdBy: { __typename?: 'User', id: string, fullName: string }, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string, name: string, submissionTime: SubmissionTime, instruction: string, required: boolean, type: string, data?: any | null, ownSubmissions: Array<{ __typename?: 'EventSubmission', id: string, data: any }> }>, organizer: { __typename?: 'EventOrganizer', id: string, link?: string | null, text: string }, activeRegistration?: { __typename?: 'EventRegistration', id: string, didAttend: boolean, status: RegistrationStatus, transactionId?: string | null, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, createdAt: any, amount: any, status: string, paymentIntent: string, checkoutSession: string } } | null, user: { __typename?: 'User', id: string, fullName: string } } | null, organizers: Array<{ __typename?: 'User', id: string, fullName: string, phone?: string | null }> } };

export type LoadRegistrationForMoveQueryVariables = Exact<{
  registrationId: Scalars['ID'];
}>;


export type LoadRegistrationForMoveQuery = { __typename?: 'Query', registration: { __typename?: 'EventRegistration', id: string, eventId: string, deletingCode?: { __typename?: 'EventRegistrationCode', id: string, isPublic: boolean } | null } };

export type VerifyCertificateMutationVariables = Exact<{
  cert: Scalars['String'];
}>;


export type VerifyCertificateMutation = { __typename?: 'Mutation', verifyDCC: { __typename?: 'DCC', status: string, card?: { __typename?: 'DCCCard', name: string, test?: any | null, vaccination?: any | null, recovery?: any | null } | null } };

export type CreateEventRegistrationCodeMutationVariables = Exact<{
  eventId: Scalars['ID'];
  registrationId?: InputMaybe<Scalars['ID']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  sepaAllowed?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateEventRegistrationCodeMutation = { __typename?: 'Mutation', createRegistrationCode: { __typename?: 'EventRegistrationCode', id: string } };

export type LoadEventForRunningQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventForRunningQuery = { __typename?: 'Query', event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, participantLimit: number, participantRegistrationCount: number, participantsAttended: number, createdBy: { __typename?: 'User', id: string, fullName: string }, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, checkInTime?: any | null, user: { __typename?: 'User', id: string, fullName: string, phone?: string | null, picture: string, email: string } }>, costItems: Array<{ __typename?: 'CostItem', id: string, amount: any, actualAmount?: any | null, submittedAmount: any, name: string, receipts: Array<{ __typename?: 'Receipt', id: string }> }>, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, checkInTime?: any | null, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string } } | null, submissions: Array<{ __typename?: 'EventSubmission', id: string, data: any, submissionItem: { __typename?: 'EventSubmissionItem', id: string, name: string } }>, user: { __typename?: 'User', id: string, fullName: string, phone?: string | null, picture: string, email: string } }> } };

export type GetCostItemQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCostItemQuery = { __typename?: 'Query', costItem: { __typename?: 'CostItem', id: string, name: string, amount: any, submittedAmount: any, event: { __typename?: 'TumiEvent', id: string, title: string }, receipts: Array<{ __typename?: 'Receipt', id: string, createdAt: any, amount: any, url: string, type?: string | null, originalUrl: string, user: { __typename?: 'User', id: string, fullName: string } }> } };

export type GetBlobTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBlobTokenQuery = { __typename?: 'Query', blobUploadKey: string };

export type AddReceiptMutationVariables = Exact<{
  costItemId: Scalars['ID'];
  receiptInput: CreateReceiptInput;
}>;


export type AddReceiptMutation = { __typename?: 'Mutation', createReceipt: { __typename?: 'Receipt', id: string, amount: any, url: string, costItem: { __typename?: 'CostItem', id: string, receipts: Array<{ __typename?: 'Receipt', id: string }> } } };

export type DeleteReceiptMutationVariables = Exact<{
  receiptId: Scalars['ID'];
}>;


export type DeleteReceiptMutation = { __typename?: 'Mutation', deleteReceipt: { __typename?: 'Receipt', id: string, costItem: { __typename?: 'CostItem', id: string, receipts: Array<{ __typename?: 'Receipt', id: string }> } } };

export type GetRegistrationQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRegistrationQuery = { __typename?: 'Query', registration: { __typename?: 'EventRegistration', id: string, type: RegistrationType, didAttend: boolean, checkInTime?: any | null, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string } } | null, event: { __typename?: 'TumiEvent', id: string, title: string, icon: string }, user: { __typename?: 'User', id: string, fullName: string, picture: string } } };

export type CheckInUserMutationVariables = Exact<{
  id: Scalars['ID'];
  manual?: InputMaybe<Scalars['Boolean']>;
}>;


export type CheckInUserMutation = { __typename?: 'Mutation', checkInUser: { __typename?: 'EventRegistration', id: string, checkInTime?: any | null, didAttend: boolean } };

export type LoadEventForManagementQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventForManagementQuery = { __typename?: 'Query', event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, amountCollected: any, netAmountCollected: any, feesPaid: any, refundFeesPaid: any, plannedSpend: any, submittedSpend: any, participantLimit: number, participantRegistrationCount: number, participantsAttended: number, costItems: Array<{ __typename?: 'CostItem', id: string, name: string, submittedAmount: any, amount: any }>, eventTemplate: { __typename?: 'EventTemplate', id: string, title: string }, eventRegistrationCodes: Array<{ __typename?: 'EventRegistrationCode', id: string, isPublic: boolean, status: RegistrationStatus, registrationToRemoveId?: string | null, registrationCreatedId?: string | null }>, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, user: { __typename?: 'User', id: string, fullName: string, picture: string, email: string, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus } | null } }>, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, checkInTime?: any | null, didAttend: boolean, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, netAmount?: any | null, refundedAmount?: any | null, netLessRefundAmount: any } } | null, submissions: Array<{ __typename?: 'EventSubmission', id: string, data: any, submissionItem: { __typename?: 'EventSubmissionItem', id: string, name: string } }>, user: { __typename?: 'User', id: string, fullName: string, picture: string, email: string, phone?: string | null, university?: string | null, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus } | null } }> } };

export type GetUserPaymentStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserPaymentStatusQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, stripeData?: { __typename?: 'StripeUserData', id: string, paymentMethodId?: string | null } | null } | null } | null };

export type DeregisterFromEventMutationVariables = Exact<{
  registrationId: Scalars['ID'];
  withRefund?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeregisterFromEventMutation = { __typename?: 'Mutation', deregisterFromEvent: { __typename?: 'TumiEvent', id: string, participantRegistrationCount: number, userIsRegistered: boolean, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus }>, activeRegistration?: { __typename?: 'EventRegistration', id: string } | null, organizers: Array<{ __typename?: 'User', id: string, fullName: string, picture: string }> } };

export type LoadUsersByStatusQueryVariables = Exact<{
  allowList: Array<MembershipStatus> | MembershipStatus;
}>;


export type LoadUsersByStatusQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string }> };

export type EventListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
  before?: InputMaybe<Scalars['DateTime']>;
}>;


export type EventListQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, registrationStart: any, prices?: any | null, freeParticipantSpots: string, organizerLimit: number, organizersRegistered: number, couldBeOrganizer: boolean, publicationState: PublicationState, registrationMode: RegistrationMode, userIsRegistered: boolean, userIsOrganizer: boolean }> };

export type LoadEventForEditQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventForEditQuery = { __typename?: 'Query', event: { __typename?: 'TumiEvent', coordinates?: any | null, couldBeOrganizer: boolean, couldBeParticipant: boolean, description: string, disableDeregistration: boolean, end: any, eventOrganizerId: string, icon: string, id: string, insuranceDescription: string, location: string, googlePlaceId?: string | null, googlePlaceUrl?: string | null, organizerLimit: number, organizerRegistrationPossible: boolean, organizerSignup: Array<string>, organizerText: string, participantLimit: number, participantSignup: Array<string>, participantText: string, prices?: any | null, publicationState: PublicationState, registrationLink?: string | null, registrationMode: RegistrationMode, registrationStart: any, shouldBeReportedToInsurance: boolean, start: any, title: string, eventTemplate: { __typename?: 'EventTemplate', id: string, title: string }, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string, createdAt: any, required: boolean, submissionTime: SubmissionTime, type: string, instruction: string, name: string, data?: any | null }>, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, user: { __typename?: 'User', picture: string, fullName: string } }>, organizers: Array<{ __typename?: 'User', fullName: string, picture: string, id: string }> }, currentUser?: { __typename?: 'User', id: string, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } | null } | null, eventOrganizers: Array<{ __typename?: 'EventOrganizer', id: string, name: string }> };

export type UpdateEventTemplateConnectionMutationVariables = Exact<{
  eventId: Scalars['ID'];
  templateId: Scalars['ID'];
}>;


export type UpdateEventTemplateConnectionMutation = { __typename?: 'Mutation', updateEventTemplateConnection: { __typename?: 'TumiEvent', id: string, eventTemplate: { __typename?: 'EventTemplate', id: string, title: string } } };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: { __typename?: 'TumiEvent', id: string } };

export type AddOrganizerToEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type AddOrganizerToEventMutation = { __typename?: 'Mutation', addOrganizerToEvent: { __typename?: 'TumiEvent', id: string, organizers: Array<{ __typename?: 'User', fullName: string, picture: string, id: string }> } };

export type UpdateGeneralEventMutationVariables = Exact<{
  id: Scalars['ID'];
  data: UpdateGeneralEventInput;
}>;


export type UpdateGeneralEventMutation = { __typename?: 'Mutation', updateEventGeneralInfo: { __typename?: 'TumiEvent', id: string, description: string, organizerText: string, participantText: string } };

export type UpdateCoreEventMutationVariables = Exact<{
  id: Scalars['ID'];
  data: UpdateCoreEventInput;
}>;


export type UpdateCoreEventMutation = { __typename?: 'Mutation', updateEventCoreInfo: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, registrationStart: any, prices?: any | null, registrationMode: RegistrationMode, registrationLink?: string | null, eventOrganizerId: string, organizerSignup: Array<string>, participantSignup: Array<string>, participantLimit: number, organizerLimit: number } };

export type UpdatePublicationMutationVariables = Exact<{
  id: Scalars['ID'];
  state: PublicationState;
}>;


export type UpdatePublicationMutation = { __typename?: 'Mutation', changeEventPublication: { __typename?: 'TumiEvent', id: string, publicationState: PublicationState } };

export type UpdateEventLocationMutationVariables = Exact<{
  eventId: Scalars['ID'];
  update: UpdateEventLocationInput;
}>;


export type UpdateEventLocationMutation = { __typename?: 'Mutation', updateEventLocation: { __typename?: 'TumiEvent', id: string, location: string, coordinates?: any | null } };

export type AddSubmissionToEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  submissionItem: CreateSubmissionItemInput;
}>;


export type AddSubmissionToEventMutation = { __typename?: 'Mutation', createSubmissionItem: { __typename?: 'EventSubmissionItem', id: string, createdAt: any, required: boolean, submissionTime: SubmissionTime, type: string, instruction: string, name: string, event: { __typename?: 'TumiEvent', id: string, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string }> } } };

export type RemoveSubmissionFromEventMutationVariables = Exact<{
  submissionItemId: Scalars['ID'];
}>;


export type RemoveSubmissionFromEventMutation = { __typename?: 'Mutation', deleteSubmissionItem: { __typename?: 'EventSubmissionItem', id: string, event: { __typename?: 'TumiEvent', id: string, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string }> } } };

export type GetPhotosOfEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GetPhotosOfEventQuery = { __typename?: 'Query', photos: Array<{ __typename?: 'PhotoShare', id: string, cols: number, rows: number, src: string, original: string, originalBlob: string, type: string, creator: { __typename?: 'User', id: string, fullName: string }, event: { __typename?: 'TumiEvent', id: string, title: string } }>, event: { __typename?: 'TumiEvent', id: string, title: string } };

export type GetPhotoShareKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPhotoShareKeyQuery = { __typename?: 'Query', photoShareKey: string };

export type CreatePhotoShareMutationVariables = Exact<{
  data: CreatePhotoShareInput;
  eventId: Scalars['ID'];
}>;


export type CreatePhotoShareMutation = { __typename?: 'Mutation', createPhotoShare: { __typename?: 'PhotoShare', id: string } };

export type LoadPublicRegistrationCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadPublicRegistrationCodesQuery = { __typename?: 'Query', eventRegistrationCodes: Array<{ __typename?: 'EventRegistrationCode', id: string, targetEvent: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any } }> };

export type GetHomePageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHomePageDataQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any }>, currentUser?: { __typename?: 'User', id: string } | null };

export type LoadPagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadPagesQuery = { __typename?: 'Query', currentTenant: { __typename?: 'Tenant', id: string, name: string, imprintPage: string, privacyPolicyPage: string, faqPage?: string | null, aboutPage: string, tacPage?: string | null } };

export type RegisterUserMutationVariables = Exact<{
  userInput: CreateUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string } };

export type GetPhotoJourneyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPhotoJourneyQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', eventRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus, event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, location: string, start: any, photoShares: Array<{ __typename?: 'PhotoShare', id: string, type: string, src: string, original: string, originalBlob: string, container: string, cols: number, rows: number }> } }> } | null };

export type UserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProfileQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, picture: string, emailVerified: boolean, email: string, phone?: string | null, university?: string | null, iban?: string | null, paypal?: string | null, birthdate?: any | null, firstName: string, lastName: string, calendarToken: string, hasESNCard: boolean, enrolmentStatus: EnrolmentStatus, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus, stripeData?: { __typename?: 'StripeUserData', paymentMethodId?: string | null } | null } | null, organizedEvents: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, needsRating: boolean, userIsOrganizer: boolean }>, participatedEvents: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, needsRating: boolean, userIsOrganizer: boolean }> } | null };

export type GetRegistrationCodeInfoQueryVariables = Exact<{
  code: Scalars['ID'];
}>;


export type GetRegistrationCodeInfoQuery = { __typename?: 'Query', eventRegistrationCode: { __typename?: 'EventRegistrationCode', id: string, status: RegistrationStatus, registrationCreated?: { __typename?: 'EventRegistration', id: string, belongsToCurrentUser: boolean, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, checkoutSession: string } } | null } | null, targetEvent: { __typename?: 'TumiEvent', id: string, registrationMode: RegistrationMode, title: string, start: any, prices?: any | null } } };

export type SubmitEventFeedbackMutationVariables = Exact<{
  id: Scalars['ID'];
  rating: Scalars['Int'];
  comment?: InputMaybe<Scalars['String']>;
}>;


export type SubmitEventFeedbackMutation = { __typename?: 'Mutation', rateEvent: { __typename?: 'TumiEvent', id: string, needsRating: boolean } };

export type UseRegistrationCodeMutationVariables = Exact<{
  id: Scalars['ID'];
  price?: InputMaybe<Scalars['JSON']>;
}>;


export type UseRegistrationCodeMutation = { __typename?: 'Mutation', useRegistrationCode: { __typename?: 'EventRegistrationCode', id: string, status: RegistrationStatus, registrationCreated?: { __typename?: 'EventRegistration', id: string, belongsToCurrentUser: boolean, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, checkoutSession: string } } | null } | null, targetEvent: { __typename?: 'TumiEvent', id: string, registrationMode: RegistrationMode, title: string, start: any, prices?: any | null } } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateUserInput;
  userId: Scalars['ID'];
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, firstName: string, lastName: string, fullName: string, university?: string | null, enrolmentStatus: EnrolmentStatus, phone?: string | null } };

export type UserRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserRolesQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, hasESNCard: boolean, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } | null } | null };

export type CreateSubmissionItemMutationVariables = Exact<{
  target?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  input: CreateSubmissionItemInput;
}>;


export type CreateSubmissionItemMutation = { __typename?: 'Mutation', createSubmissionItem: { __typename?: 'EventSubmissionItem', id: string } };

export type DeleteSubmissionItemMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteSubmissionItemMutation = { __typename?: 'Mutation', deleteSubmissionItem: { __typename?: 'EventSubmissionItem', id: string } };

export type GetRegistrationsQueryVariables = Exact<{
  pageLength?: InputMaybe<Scalars['Int']>;
  pageIndex?: InputMaybe<Scalars['Int']>;
}>;


export type GetRegistrationsQuery = { __typename?: 'Query', registrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, type: RegistrationType, event: { __typename?: 'TumiEvent', title: string, id: string }, user: { __typename?: 'User', id: string, fullName: string }, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, netAmount?: any | null } } | null }> };

export type GetRegistrationForAdminQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRegistrationForAdminQuery = { __typename?: 'Query', registration: { __typename?: 'EventRegistration', id: string, createdAt: any, type: RegistrationType, status: RegistrationStatus, cancellationReason?: string | null, event: { __typename?: 'TumiEvent', title: string, id: string, start: any, end: any }, user: { __typename?: 'User', id: string, fullName: string }, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, netAmount?: any | null, refundedAmount?: any | null, amount: any, feeAmount?: any | null, paymentIntent: string, paymentMethodType?: string | null, events: any } } | null } };

export type GetRegistrationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRegistrationCountQuery = { __typename?: 'Query', registrationCount: number };

export type GetCancelledRegistrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCancelledRegistrationsQuery = { __typename?: 'Query', registrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, cancellationReason?: string | null, event: { __typename?: 'TumiEvent', title: string, id: string }, user: { __typename?: 'User', id: string, fullName: string } }> };

export type GetEventRegistrationCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventRegistrationCodesQuery = { __typename?: 'Query', eventRegistrationCodes: Array<{ __typename?: 'EventRegistrationCode', id: string, createdAt: any, isPublic: boolean, status: RegistrationStatus, targetEvent: { __typename?: 'TumiEvent', id: string, title: string }, creator: { __typename?: 'User', id: string, fullName: string }, registrationToRemove?: { __typename?: 'EventRegistration', id: string } | null, registrationCreated?: { __typename?: 'EventRegistration', id: string, createdAt: any, user: { __typename?: 'User', id: string, fullName: string } } | null }> };

export type GetEventRegistrationCodeQueryVariables = Exact<{
  registrationId: Scalars['ID'];
}>;


export type GetEventRegistrationCodeQuery = { __typename?: 'Query', eventRegistrationCode: { __typename?: 'EventRegistrationCode', id: string, createdAt: any, isPublic: boolean, status: RegistrationStatus, sepaAllowed: boolean, targetEvent: { __typename?: 'TumiEvent', id: string, title: string, start: any, end: any }, creator: { __typename?: 'User', id: string, email: string, fullName: string }, connectedRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, user: { __typename?: 'User', id: string, fullName: string }, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, paymentIntent: string, events: any } } | null }>, registrationToRemove?: { __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, user: { __typename?: 'User', id: string, fullName: string }, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, paymentIntent: string, events: any } } | null } | null, registrationCreated?: { __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, user: { __typename?: 'User', id: string, fullName: string }, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, paymentIntent: string, paymentMethodType?: string | null, events: any } } | null } | null } };

export type LoadEventCategoriesForAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadEventCategoriesForAdminQuery = { __typename?: 'Query', eventTemplateCategories: Array<{ __typename?: 'EventTemplateCategory', id: string, name: string, icon: string }> };

export type CreateEventTemplateCategoryMutationVariables = Exact<{
  input: CreateEventTemplateCategoryInput;
}>;


export type CreateEventTemplateCategoryMutation = { __typename?: 'Mutation', createEventTemplateCategory: { __typename?: 'EventTemplateCategory', id: string, name: string, icon: string } };

export type DeleteEventTemplateCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEventTemplateCategoryMutation = { __typename?: 'Mutation', deleteEventTemplateCategory: { __typename?: 'EventTemplateCategory', id: string, name: string, icon: string } };

export type CreateOrganizerMutationVariables = Exact<{
  input: NewOrganizerInput;
}>;


export type CreateOrganizerMutation = { __typename?: 'Mutation', createEventOrganizer: { __typename?: 'EventOrganizer', id: string } };

export type LoadEventsForInsuranceQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadEventsForInsuranceQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any, shouldBeReportedToInsurance: boolean, insuranceDescription: string, organizerLimit: number, participantLimit: number, publicationState: PublicationState, organizer: { __typename?: 'EventOrganizer', id: string, name: string } }> };

export type LoadTransactionsQueryVariables = Exact<{
  range?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type LoadTransactionsQuery = { __typename?: 'Query', transactionCount: number, transactionSumAmount: number, transactions: Array<{ __typename?: 'Transaction', id: string, amount: any, createdAt: any, eventRegistration?: { __typename?: 'EventRegistration', id: string, event: { __typename?: 'TumiEvent', id: string, title: string } } | null, user?: { __typename?: 'User', id: string, fullName: string } | null }> };

export type LoadEventsWithBookingQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
}>;


export type LoadEventsWithBookingQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any, icon: string, registrationMode: RegistrationMode, registrationStart: any, participantLimit: number, participantRegistrationCount: number, countedParticipantRegistrations: number, organizer: { __typename?: 'EventOrganizer', id: string, name: string } }> };

export type LoadEventsWithRatingQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
}>;


export type LoadEventsWithRatingQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any, icon: string, participantRatings?: number | null, organizerRatings?: number | null, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus, rating?: number | null, userComment?: string | null }>, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus, rating?: number | null, userComment?: string | null }>, organizer: { __typename?: 'EventOrganizer', id: string, name: string } }> };

export type LoadAllPhotosQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadAllPhotosQuery = { __typename?: 'Query', photos: Array<{ __typename?: 'PhotoShare', id: string, cols: number, rows: number, src: string, original: string, originalBlob: string, type: string, event: { __typename?: 'TumiEvent', id: string, title: string }, creator: { __typename?: 'User', id: string, fullName: string } }> };

export type LoadUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, authId: string, firstName: string, lastName: string, fullName: string, email: string, birthdate?: any | null, phone?: string | null, university?: string | null, hasESNCard: boolean, esnCardOverride: boolean, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } | null, eventRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, checkInTime?: any | null, type: RegistrationType, status: RegistrationStatus, deletingCode?: { __typename?: 'EventRegistrationCode', id: string, createdAt: any } | null, creatingCode?: { __typename?: 'EventRegistrationCode', id: string, createdAt: any } | null, transaction?: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, events: any } } | null, event: { __typename?: 'TumiEvent', id: string, title: string, start: any, end: any } }> } };

export type GetTenantForEditQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantForEditQuery = { __typename?: 'Query', currentTenant: { __typename?: 'Tenant', id: string, name: string, imprintPage: string, aboutPage: string, privacyPolicyPage: string, faqPage?: string | null, tacPage?: string | null } };

export type GetOrganizersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizersQuery = { __typename?: 'Query', eventOrganizers: Array<{ __typename?: 'EventOrganizer', id: string, name: string, text: string }> };

export type GetUsersQueryVariables = Exact<{
  roleList?: InputMaybe<Array<Role> | Role>;
  statusList?: InputMaybe<Array<MembershipStatus> | MembershipStatus>;
  search?: InputMaybe<Scalars['String']>;
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageLength?: InputMaybe<Scalars['Int']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', userSearchResultNum: number, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, currentTenant?: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } | null }> };

export type GetStatisticsQueryVariables = Exact<{
  range?: InputMaybe<DateRangeInput>;
  tenantId?: InputMaybe<Scalars['ID']>;
}>;


export type GetStatisticsQuery = { __typename?: 'Query', statistics: { __typename?: 'Statistics', usersRegistered: number, usersWithCustomer: number, usersWithPaymentMethod: number, registrations: number, userHistory: any, registrationHistory: any, checkinHistory: any, userEventDistribution: any, usersRegisteredEvents: number, usersRegisteredFreeEvents: number, usersRegisteredPaidEvents: number, checkins: number, paidRegistrations: number, totalEvents: number, paidEvents: number, userUniversityDistribution: any, userStatusDistribution: any } };

export type GetLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLogsQuery = { __typename?: 'Query', logs: Array<{ __typename?: 'ActivityLog', id: string, createdAt: any, message: string, severity: string, data?: any | null, oldData?: any | null }>, logStats: Array<{ __typename?: 'ActivityLogStat', count: number, message: string }> };

export type GetTenantPurchasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantPurchasesQuery = { __typename?: 'Query', purchases: Array<{ __typename?: 'Purchase', id: string, createdAt: any, status: PurchaseStatus, user: { __typename?: 'User', id: string, email: string, fullName: string, university?: string | null }, transaction: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, amount: any } } }> };

export type GetPurchaseQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPurchaseQuery = { __typename?: 'Query', purchase: { __typename?: 'Purchase', id: string, status: PurchaseStatus, createdAt: any, user: { __typename?: 'User', id: string, email: string, fullName: string, university?: string | null }, transaction: { __typename?: 'Transaction', id: string, stripePayment: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, events: any, shipping?: any | null, amount: any, netAmount?: any | null, feeAmount?: any | null } }, items: Array<{ __typename?: 'LineItem', id: string, quantity: number, product: { __typename?: 'Product', id: string, title: string, leadImage: { __typename?: 'ProductImage', id: string, src: string } }, submissions: Array<{ __typename?: 'EventSubmission', id: string, data: any, submissionItem: { __typename?: 'EventSubmissionItem', id: string, name: string } }> }> } };

export type UpdateTenantMutationVariables = Exact<{
  id: Scalars['ID'];
  update: UpdateTenantInput;
}>;


export type UpdateTenantMutation = { __typename?: 'Mutation', updateTenant: { __typename?: 'Tenant', id: string, faqPage?: string | null, imprintPage: string, privacyPolicyPage: string, aboutPage: string, tacPage?: string | null } };

export type UpdateEsNcardMutationVariables = Exact<{
  userId: Scalars['ID'];
  override: Scalars['Boolean'];
}>;


export type UpdateEsNcardMutation = { __typename?: 'Mutation', updateESNCard: { __typename?: 'User', id: string, esnCardOverride: boolean, hasESNCard: boolean } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  role: Role;
  status: MembershipStatus;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUserRole: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role }, updateUserStatus: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus } };

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
    providedIn: 'root'
  })
  export class GetCurrentUserGQL extends Apollo.Query<GetCurrentUserQuery, GetCurrentUserQueryVariables> {
    override document = GetCurrentUserDocument;
    
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
  }
  currentUser {
    id
    outstandingRating
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantInfoGQL extends Apollo.Query<GetTenantInfoQuery, GetTenantInfoQueryVariables> {
    override document = GetTenantInfoDocument;
    
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
    providedIn: 'root'
  })
  export class CreateEventTemplateGQL extends Apollo.Mutation<CreateEventTemplateMutation, CreateEventTemplateMutationVariables> {
    override document = CreateEventTemplateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEventFromTemplateDocument = gql`
    mutation createEventFromTemplate($templateId: ID!, $eventData: CreateEventFromTemplateInput!) {
  createEventFromTemplate(templateId: $templateId, input: $eventData) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEventFromTemplateGQL extends Apollo.Mutation<CreateEventFromTemplateMutation, CreateEventFromTemplateMutationVariables> {
    override document = CreateEventFromTemplateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateTemplateLocationDocument = gql`
    mutation updateTemplateLocation($templateId: ID!, $update: UpdateTemplateLocationInput!) {
  updateTemplateLocation(templateId: $templateId, location: $update) {
    id
    location
    coordinates
    googlePlaceUrl
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateTemplateLocationGQL extends Apollo.Mutation<UpdateTemplateLocationMutation, UpdateTemplateLocationMutationVariables> {
    override document = UpdateTemplateLocationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEventTemplateCategoryAssignmentDocument = gql`
    mutation updateEventTemplateCategoryAssignment($templateId: ID!, $categoryId: ID!) {
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
    providedIn: 'root'
  })
  export class UpdateEventTemplateCategoryAssignmentGQL extends Apollo.Mutation<UpdateEventTemplateCategoryAssignmentMutation, UpdateEventTemplateCategoryAssignmentMutationVariables> {
    override document = UpdateEventTemplateCategoryAssignmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEventTemplateDocument = gql`
    mutation updateEventTemplate($templateId: ID!, $update: UpdateTemplateInput!) {
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
    insuranceDescription
    shouldBeReportedToInsurance
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEventTemplateGQL extends Apollo.Mutation<UpdateEventTemplateMutation, UpdateEventTemplateMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteEventTemplateGQL extends Apollo.Mutation<DeleteEventTemplateMutation, DeleteEventTemplateMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteTemplateGQL extends Apollo.Mutation<DeleteTemplateMutation, DeleteTemplateMutationVariables> {
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
    providedIn: 'root'
  })
  export class GetEventTemplatesGQL extends Apollo.Query<GetEventTemplatesQuery, GetEventTemplatesQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetTemplateCategoriesWithTemplatesGQL extends Apollo.Query<GetTemplateCategoriesWithTemplatesQuery, GetTemplateCategoriesWithTemplatesQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetEventTemplateCategoriesGQL extends Apollo.Query<GetEventTemplateCategoriesQuery, GetEventTemplateCategoriesQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetLonelyEventTemplatesGQL extends Apollo.Query<GetLonelyEventTemplatesQuery, GetLonelyEventTemplatesQueryVariables> {
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
    finances
    insuranceDescription
    shouldBeReportedToInsurance
    category {
      id
      name
      icon
    }
    eventInstances {
      id
      title
      start
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEventTemplateGQL extends Apollo.Query<GetEventTemplateQuery, GetEventTemplateQueryVariables> {
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
    providedIn: 'root'
  })
  export class UpdateFinancesGQL extends Apollo.Mutation<UpdateFinancesMutation, UpdateFinancesMutationVariables> {
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
    providedIn: 'root'
  })
  export class GetOrganizerOptionsGQL extends Apollo.Query<GetOrganizerOptionsQuery, GetOrganizerOptionsQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetCostItemsForEventGQL extends Apollo.Query<GetCostItemsForEventQuery, GetCostItemsForEventQueryVariables> {
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
      onInvoice
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCostItemsFromTemplateGQL extends Apollo.Mutation<UpdateCostItemsFromTemplateMutation, UpdateCostItemsFromTemplateMutationVariables> {
    override document = UpdateCostItemsFromTemplateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterForEventDocument = gql`
    mutation registerForEvent($eventId: ID!, $type: RegistrationType, $submissions: JSON, $price: JSON) {
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
      transaction {
        id
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
    organizers {
      fullName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterForEventGQL extends Apollo.Mutation<RegisterForEventMutation, RegisterForEventMutationVariables> {
    override document = RegisterForEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoadEventDocument = gql`
    query loadEvent($id: ID!) {
  currentUser {
    id
    hasESNCard
    university
  }
  event(id: $id) {
    id
    title
    icon
    start
    end
    registrationStart
    disableDeregistration
    publicationState
    description
    organizerText
    organizerLimit
    participantText
    registrationMode
    registrationLink
    freeParticipantSpots
    prices
    location
    coordinates
    googlePlaceUrl
    createdBy {
      id
      fullName
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
      transactionId
      transaction {
        id
        stripePayment {
          id
          createdAt
          amount
          status
          paymentIntent
          checkoutSession
        }
      }
      user {
        id
        fullName
      }
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
    participantRegistrationCount
    couldBeOrganizer
    couldBeParticipant
    organizers {
      id
      fullName
      phone
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoadEventGQL extends Apollo.Query<LoadEventQuery, LoadEventQueryVariables> {
    override document = LoadEventDocument;
    
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
    providedIn: 'root'
  })
  export class LoadRegistrationForMoveGQL extends Apollo.Query<LoadRegistrationForMoveQuery, LoadRegistrationForMoveQueryVariables> {
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
    providedIn: 'root'
  })
  export class VerifyCertificateGQL extends Apollo.Mutation<VerifyCertificateMutation, VerifyCertificateMutationVariables> {
    override document = VerifyCertificateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEventRegistrationCodeDocument = gql`
    mutation createEventRegistrationCode($eventId: ID!, $registrationId: ID, $isPublic: Boolean, $sepaAllowed: Boolean) {
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
    providedIn: 'root'
  })
  export class CreateEventRegistrationCodeGQL extends Apollo.Mutation<CreateEventRegistrationCodeMutation, CreateEventRegistrationCodeMutationVariables> {
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
    participantRegistrations {
      id
      checkInTime
      transaction {
        id
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
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoadEventForRunningGQL extends Apollo.Query<LoadEventForRunningQuery, LoadEventForRunningQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetCostItemGQL extends Apollo.Query<GetCostItemQuery, GetCostItemQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetBlobTokenGQL extends Apollo.Query<GetBlobTokenQuery, GetBlobTokenQueryVariables> {
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
    providedIn: 'root'
  })
  export class AddReceiptGQL extends Apollo.Mutation<AddReceiptMutation, AddReceiptMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteReceiptGQL extends Apollo.Mutation<DeleteReceiptMutation, DeleteReceiptMutationVariables> {
    override document = DeleteReceiptDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetRegistrationDocument = gql`
    query getRegistration($id: ID!) {
  registration(id: $id) {
    id
    transaction {
      id
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
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetRegistrationGQL extends Apollo.Query<GetRegistrationQuery, GetRegistrationQueryVariables> {
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
    providedIn: 'root'
  })
  export class CheckInUserGQL extends Apollo.Mutation<CheckInUserMutation, CheckInUserMutationVariables> {
    override document = CheckInUserDocument;
    
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
      transaction {
        id
        stripePayment {
          id
          status
          paymentMethodType
          netAmount
          refundedAmount
          netLessRefundAmount
        }
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
    providedIn: 'root'
  })
  export class LoadEventForManagementGQL extends Apollo.Query<LoadEventForManagementQuery, LoadEventForManagementQueryVariables> {
    override document = LoadEventForManagementDocument;
    
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
      stripeData {
        id
        paymentMethodId
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserPaymentStatusGQL extends Apollo.Query<GetUserPaymentStatusQuery, GetUserPaymentStatusQueryVariables> {
    override document = GetUserPaymentStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeregisterFromEventDocument = gql`
    mutation deregisterFromEvent($registrationId: ID!, $withRefund: Boolean) {
  deregisterFromEvent(registrationId: $registrationId, withRefund: $withRefund) {
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
    providedIn: 'root'
  })
  export class DeregisterFromEventGQL extends Apollo.Mutation<DeregisterFromEventMutation, DeregisterFromEventMutationVariables> {
    override document = DeregisterFromEventDocument;
    
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
    providedIn: 'root'
  })
  export class LoadUsersByStatusGQL extends Apollo.Query<LoadUsersByStatusQuery, LoadUsersByStatusQueryVariables> {
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
    prices
    freeParticipantSpots
    organizerLimit
    organizersRegistered
    couldBeOrganizer
    publicationState
    registrationMode
    userIsRegistered
    userIsOrganizer
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EventListGQL extends Apollo.Query<EventListQuery, EventListQueryVariables> {
    override document = EventListDocument;
    
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
    description
    disableDeregistration
    end
    eventOrganizerId
    icon
    id
    insuranceDescription
    location
    googlePlaceId
    googlePlaceUrl
    organizerLimit
    organizerRegistrationPossible
    organizerSignup
    organizerText
    participantLimit
    participantSignup
    participantText
    prices
    publicationState
    registrationLink
    registrationMode
    registrationStart
    shouldBeReportedToInsurance
    start
    title
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
        picture
        fullName
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
    providedIn: 'root'
  })
  export class LoadEventForEditGQL extends Apollo.Query<LoadEventForEditQuery, LoadEventForEditQueryVariables> {
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
    providedIn: 'root'
  })
  export class UpdateEventTemplateConnectionGQL extends Apollo.Mutation<UpdateEventTemplateConnectionMutation, UpdateEventTemplateConnectionMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteEventGQL extends Apollo.Mutation<DeleteEventMutation, DeleteEventMutationVariables> {
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
    providedIn: 'root'
  })
  export class AddOrganizerToEventGQL extends Apollo.Mutation<AddOrganizerToEventMutation, AddOrganizerToEventMutationVariables> {
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
    providedIn: 'root'
  })
  export class UpdateGeneralEventGQL extends Apollo.Mutation<UpdateGeneralEventMutation, UpdateGeneralEventMutationVariables> {
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
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCoreEventGQL extends Apollo.Mutation<UpdateCoreEventMutation, UpdateCoreEventMutationVariables> {
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
    providedIn: 'root'
  })
  export class UpdatePublicationGQL extends Apollo.Mutation<UpdatePublicationMutation, UpdatePublicationMutationVariables> {
    override document = UpdatePublicationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEventLocationDocument = gql`
    mutation updateEventLocation($eventId: ID!, $update: UpdateEventLocationInput!) {
  updateEventLocation(eventId: $eventId, input: $update) {
    id
    location
    coordinates
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEventLocationGQL extends Apollo.Mutation<UpdateEventLocationMutation, UpdateEventLocationMutationVariables> {
    override document = UpdateEventLocationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddSubmissionToEventDocument = gql`
    mutation addSubmissionToEvent($eventId: ID!, $submissionItem: CreateSubmissionItemInput!) {
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
    providedIn: 'root'
  })
  export class AddSubmissionToEventGQL extends Apollo.Mutation<AddSubmissionToEventMutation, AddSubmissionToEventMutationVariables> {
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
    providedIn: 'root'
  })
  export class RemoveSubmissionFromEventGQL extends Apollo.Mutation<RemoveSubmissionFromEventMutation, RemoveSubmissionFromEventMutationVariables> {
    override document = RemoveSubmissionFromEventDocument;
    
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
    providedIn: 'root'
  })
  export class GetPhotosOfEventGQL extends Apollo.Query<GetPhotosOfEventQuery, GetPhotosOfEventQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetPhotoShareKeyGQL extends Apollo.Query<GetPhotoShareKeyQuery, GetPhotoShareKeyQueryVariables> {
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
    providedIn: 'root'
  })
  export class CreatePhotoShareGQL extends Apollo.Mutation<CreatePhotoShareMutation, CreatePhotoShareMutationVariables> {
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
    providedIn: 'root'
  })
  export class LoadPublicRegistrationCodesGQL extends Apollo.Query<LoadPublicRegistrationCodesQuery, LoadPublicRegistrationCodesQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetHomePageDataGQL extends Apollo.Query<GetHomePageDataQuery, GetHomePageDataQueryVariables> {
    override document = GetHomePageDataDocument;
    
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
    providedIn: 'root'
  })
  export class LoadPagesGQL extends Apollo.Query<LoadPagesQuery, LoadPagesQueryVariables> {
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
    providedIn: 'root'
  })
  export class RegisterUserGQL extends Apollo.Mutation<RegisterUserMutation, RegisterUserMutationVariables> {
    override document = RegisterUserDocument;
    
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
    providedIn: 'root'
  })
  export class GetPhotoJourneyGQL extends Apollo.Query<GetPhotoJourneyQuery, GetPhotoJourneyQueryVariables> {
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
    phone
    university
    iban
    paypal
    birthdate
    firstName
    lastName
    calendarToken
    hasESNCard
    enrolmentStatus
    currentTenant {
      userId
      tenantId
      status
      stripeData {
        paymentMethodId
      }
    }
    organizedEvents(hideCancelled: true) {
      id
      title
      icon
      start
      end
      needsRating
      userIsOrganizer
    }
    participatedEvents(hideCancelled: true) {
      id
      title
      icon
      start
      end
      needsRating
      userIsOrganizer
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserProfileGQL extends Apollo.Query<UserProfileQuery, UserProfileQueryVariables> {
    override document = UserProfileDocument;
    
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
      transaction {
        id
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
    providedIn: 'root'
  })
  export class GetRegistrationCodeInfoGQL extends Apollo.Query<GetRegistrationCodeInfoQuery, GetRegistrationCodeInfoQueryVariables> {
    override document = GetRegistrationCodeInfoDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SubmitEventFeedbackDocument = gql`
    mutation submitEventFeedback($id: ID!, $rating: Int!, $comment: String) {
  rateEvent(id: $id, rating: $rating, comment: $comment) {
    id
    needsRating
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SubmitEventFeedbackGQL extends Apollo.Mutation<SubmitEventFeedbackMutation, SubmitEventFeedbackMutationVariables> {
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
      transaction {
        id
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
    providedIn: 'root'
  })
  export class UseRegistrationCodeGQL extends Apollo.Mutation<UseRegistrationCodeMutation, UseRegistrationCodeMutationVariables> {
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
    enrolmentStatus
    phone
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateProfileGQL extends Apollo.Mutation<UpdateProfileMutation, UpdateProfileMutationVariables> {
    override document = UpdateProfileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserRolesDocument = gql`
    query userRoles {
  currentUser {
    id
    fullName
    hasESNCard
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
    providedIn: 'root'
  })
  export class UserRolesGQL extends Apollo.Query<UserRolesQuery, UserRolesQueryVariables> {
    override document = UserRolesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateSubmissionItemDocument = gql`
    mutation createSubmissionItem($target: String, $id: ID!, $input: CreateSubmissionItemInput!) {
  createSubmissionItem(targetId: $id, input: $input, target: $target) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateSubmissionItemGQL extends Apollo.Mutation<CreateSubmissionItemMutation, CreateSubmissionItemMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteSubmissionItemGQL extends Apollo.Mutation<DeleteSubmissionItemMutation, DeleteSubmissionItemMutationVariables> {
    override document = DeleteSubmissionItemDocument;
    
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
    event {
      title
      id
    }
    user {
      id
      fullName
    }
    transaction {
      id
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
    providedIn: 'root'
  })
  export class GetRegistrationsGQL extends Apollo.Query<GetRegistrationsQuery, GetRegistrationsQueryVariables> {
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
    }
    user {
      id
      fullName
    }
    transaction {
      id
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
    providedIn: 'root'
  })
  export class GetRegistrationForAdminGQL extends Apollo.Query<GetRegistrationForAdminQuery, GetRegistrationForAdminQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetRegistrationCountGQL extends Apollo.Query<GetRegistrationCountQuery, GetRegistrationCountQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetCancelledRegistrationsGQL extends Apollo.Query<GetCancelledRegistrationsQuery, GetCancelledRegistrationsQueryVariables> {
    override document = GetCancelledRegistrationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetEventRegistrationCodesDocument = gql`
    query getEventRegistrationCodes {
  eventRegistrationCodes(
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
    }
    creator {
      id
      fullName
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
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEventRegistrationCodesGQL extends Apollo.Query<GetEventRegistrationCodesQuery, GetEventRegistrationCodesQueryVariables> {
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
    }
    creator {
      id
      email
      fullName
    }
    connectedRegistrations {
      id
      createdAt
      status
      cancellationReason
      user {
        id
        fullName
      }
      transaction {
        id
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
      }
      transaction {
        id
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
      }
      transaction {
        id
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
    providedIn: 'root'
  })
  export class GetEventRegistrationCodeGQL extends Apollo.Query<GetEventRegistrationCodeQuery, GetEventRegistrationCodeQueryVariables> {
    override document = GetEventRegistrationCodeDocument;
    
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
    providedIn: 'root'
  })
  export class LoadEventCategoriesForAdminGQL extends Apollo.Query<LoadEventCategoriesForAdminQuery, LoadEventCategoriesForAdminQueryVariables> {
    override document = LoadEventCategoriesForAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEventTemplateCategoryDocument = gql`
    mutation CreateEventTemplateCategory($input: CreateEventTemplateCategoryInput!) {
  createEventTemplateCategory(input: $input) {
    id
    name
    icon
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEventTemplateCategoryGQL extends Apollo.Mutation<CreateEventTemplateCategoryMutation, CreateEventTemplateCategoryMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteEventTemplateCategoryGQL extends Apollo.Mutation<DeleteEventTemplateCategoryMutation, DeleteEventTemplateCategoryMutationVariables> {
    override document = DeleteEventTemplateCategoryDocument;
    
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
    providedIn: 'root'
  })
  export class CreateOrganizerGQL extends Apollo.Mutation<CreateOrganizerMutation, CreateOrganizerMutationVariables> {
    override document = CreateOrganizerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoadEventsForInsuranceDocument = gql`
    query loadEventsForInsurance {
  events {
    id
    title
    start
    shouldBeReportedToInsurance
    insuranceDescription
    organizerLimit
    participantLimit
    publicationState
    organizer {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoadEventsForInsuranceGQL extends Apollo.Query<LoadEventsForInsuranceQuery, LoadEventsForInsuranceQueryVariables> {
    override document = LoadEventsForInsuranceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoadTransactionsDocument = gql`
    query loadTransactions($range: DateRangeInput, $search: String, $take: Int, $skip: Int) {
  transactions(range: $range, search: $search, take: $take, skip: $skip) {
    id
    amount
    createdAt
    amount
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
  transactionCount(range: $range, search: $search)
  transactionSumAmount(range: $range, search: $search)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoadTransactionsGQL extends Apollo.Query<LoadTransactionsQuery, LoadTransactionsQueryVariables> {
    override document = LoadTransactionsDocument;
    
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
    providedIn: 'root'
  })
  export class LoadEventsWithBookingGQL extends Apollo.Query<LoadEventsWithBookingQuery, LoadEventsWithBookingQueryVariables> {
    override document = LoadEventsWithBookingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoadEventsWithRatingDocument = gql`
    query loadEventsWithRating($after: DateTime) {
  events(after: $after) {
    id
    title
    start
    icon
    participantRatings
    organizerRatings
    participantRegistrations {
      id
      status
      rating
      userComment
    }
    organizerRegistrations {
      id
      status
      rating
      userComment
    }
    organizer {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoadEventsWithRatingGQL extends Apollo.Query<LoadEventsWithRatingQuery, LoadEventsWithRatingQueryVariables> {
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
    providedIn: 'root'
  })
  export class LoadAllPhotosGQL extends Apollo.Query<LoadAllPhotosQuery, LoadAllPhotosQueryVariables> {
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
    hasESNCard
    esnCardOverride
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
      transaction {
        id
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
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoadUserGQL extends Apollo.Query<LoadUserQuery, LoadUserQueryVariables> {
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
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantForEditGQL extends Apollo.Query<GetTenantForEditQuery, GetTenantForEditQueryVariables> {
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
    providedIn: 'root'
  })
  export class GetOrganizersGQL extends Apollo.Query<GetOrganizersQuery, GetOrganizersQueryVariables> {
    override document = GetOrganizersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUsersDocument = gql`
    query getUsers($roleList: [Role!], $statusList: [MembershipStatus!], $search: String, $pageIndex: Int, $pageLength: Int) {
  users(
    roleList: $roleList
    statusList: $statusList
    search: $search
    pageIndex: $pageIndex
    pageLength: $pageLength
  ) {
    id
    firstName
    lastName
    email
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
    providedIn: 'root'
  })
  export class GetUsersGQL extends Apollo.Query<GetUsersQuery, GetUsersQueryVariables> {
    override document = GetUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetStatisticsDocument = gql`
    query getStatistics($range: DateRangeInput, $tenantId: ID) {
  statistics(range: $range, tenantId: $tenantId) {
    usersRegistered
    usersWithCustomer
    usersWithPaymentMethod
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
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetStatisticsGQL extends Apollo.Query<GetStatisticsQuery, GetStatisticsQueryVariables> {
    override document = GetStatisticsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetLogsDocument = gql`
    query getLogs {
  logs {
    id
    createdAt
    message
    severity
    data
    oldData
  }
  logStats {
    count
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetLogsGQL extends Apollo.Query<GetLogsQuery, GetLogsQueryVariables> {
    override document = GetLogsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTenantPurchasesDocument = gql`
    query getTenantPurchases {
  purchases(limitToOwn: false) {
    id
    createdAt
    status
    user {
      id
      email
      fullName
      university
    }
    transaction {
      id
      stripePayment {
        id
        status
        amount
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantPurchasesGQL extends Apollo.Query<GetTenantPurchasesQuery, GetTenantPurchasesQueryVariables> {
    override document = GetTenantPurchasesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPurchaseDocument = gql`
    query getPurchase($id: ID!) {
  purchase(id: $id) {
    id
    status
    createdAt
    status
    user {
      id
      email
      fullName
      university
    }
    transaction {
      id
      stripePayment {
        id
        status
        paymentMethodType
        events
        shipping
        amount
        netAmount
        feeAmount
      }
    }
    items {
      id
      quantity
      product {
        id
        title
        leadImage {
          id
          src
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
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPurchaseGQL extends Apollo.Query<GetPurchaseQuery, GetPurchaseQueryVariables> {
    override document = GetPurchaseDocument;
    
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
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateTenantGQL extends Apollo.Mutation<UpdateTenantMutation, UpdateTenantMutationVariables> {
    override document = UpdateTenantDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEsNcardDocument = gql`
    mutation updateESNcard($userId: ID!, $override: Boolean!) {
  updateESNCard(id: $userId, esnCardOverride: $override) {
    id
    esnCardOverride
    hasESNCard
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEsNcardGQL extends Apollo.Mutation<UpdateEsNcardMutation, UpdateEsNcardMutationVariables> {
    override document = UpdateEsNcardDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserDocument = gql`
    mutation updateUser($id: ID!, $role: Role!, $status: MembershipStatus!) {
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
    providedIn: 'root'
  })
  export class UpdateUserGQL extends Apollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables> {
    override document = UpdateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }