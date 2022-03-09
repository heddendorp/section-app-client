import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `BigInt` scalar type represents non-fractional signed whole numeric values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
   */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Bytes: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** An arbitrary-precision Decimal type */
  Decimal: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any;
};

export type ActivityLog = {
  __typename?: 'ActivityLog';
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['Json']>;
  id: Scalars['ID'];
  involvedUser?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  oldData?: Maybe<Scalars['Json']>;
  severity: LogSeverity;
};

export type ActivityLogStat = {
  __typename?: 'ActivityLogStat';
  count: Scalars['Int'];
  message: Scalars['String'];
};

export type AddLineItemToBasketInput = {
  price: Scalars['Json'];
  productId: Scalars['String'];
  quantity?: InputMaybe<Scalars['Int']>;
  submissions?: InputMaybe<Scalars['Json']>;
};

export type CostItem = {
  __typename?: 'CostItem';
  actualAmount?: Maybe<Scalars['Decimal']>;
  amount: Scalars['Decimal'];
  calculationInfo: Scalars['String'];
  confirmed: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  details?: Maybe<Scalars['String']>;
  event: TumiEvent;
  eventId: Scalars['String'];
  id: Scalars['ID'];
  moneySent: Scalars['Boolean'];
  moneySentTo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  onInvoice: Scalars['Boolean'];
  receipts: Array<Receipt>;
  submittedAmount: Scalars['Decimal'];
};

/** Additional inputs to create an event from a template */
export type CreateEventFromTemplateInput = {
  end: Scalars['DateTime'];
  organizerId: Scalars['ID'];
  organizerLimit: Scalars['Int'];
  participantLimit: Scalars['Int'];
  price?: InputMaybe<Scalars['Int']>;
  registrationLink?: InputMaybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  start: Scalars['DateTime'];
};

/** Input needed to create a new event template */
export type CreateEventTemplateInput = {
  comment: Scalars['String'];
  coordinates?: InputMaybe<Scalars['Json']>;
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  icon: Scalars['String'];
  location: Scalars['String'];
  organizerText: Scalars['String'];
  participantText: Scalars['String'];
  title: Scalars['String'];
};

export type CreatePhotoShareInput = {
  cols: Scalars['Int'];
  container: Scalars['String'];
  originalBlob: Scalars['String'];
  rows: Scalars['Int'];
  type: Scalars['String'];
};

export type CreateProductImageInput = {
  container: Scalars['String'];
  originalBlob: Scalars['String'];
  type: Scalars['String'];
};

export type CreateReceiptInput = {
  amount: Scalars['Decimal'];
  blob: Scalars['String'];
  container: Scalars['String'];
  md5?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type CreateSubmissionItemInput = {
  data?: InputMaybe<Scalars['Json']>;
  instruction: Scalars['String'];
  name: Scalars['String'];
  required: Scalars['Boolean'];
  submissionTime: SubmissionTime;
  type: SubmissionItemType;
};

/** New user input object */
export type CreateUserInput = {
  birthdate: Scalars['DateTime'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  university?: InputMaybe<Scalars['String']>;
};

export type EventOrganizer = {
  __typename?: 'EventOrganizer';
  createdAt: Scalars['DateTime'];
  events: Array<TumiEvent>;
  id: Scalars['ID'];
  link?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  tenant: Tenant;
  tenantId: Scalars['String'];
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
  eventId: Scalars['String'];
  id: Scalars['ID'];
  manualCheckin: Scalars['Boolean'];
  payment?: Maybe<StripePayment>;
  paymentId?: Maybe<Scalars['String']>;
  status: RegistrationStatus;
  submissions: Array<EventSubmission>;
  type: RegistrationType;
  user: User;
  userId: Scalars['String'];
};

export type EventRegistrationCode = {
  __typename?: 'EventRegistrationCode';
  connectedRegistrations: Array<EventRegistration>;
  createdAt: Scalars['DateTime'];
  createdById: Scalars['String'];
  creator: User;
  eventId: Scalars['String'];
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  registrationCreated?: Maybe<EventRegistration>;
  registrationCreatedId?: Maybe<Scalars['String']>;
  registrationToRemove?: Maybe<EventRegistration>;
  registrationToRemoveId?: Maybe<Scalars['String']>;
  sepaAllowed: Scalars['Boolean'];
  status: RegistrationStatus;
  targetEvent: TumiEvent;
};

export type EventSubmission = {
  __typename?: 'EventSubmission';
  createdAt: Scalars['DateTime'];
  data: Scalars['Json'];
  eventRegistrationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  registration?: Maybe<EventRegistration>;
  submissionItem: EventSubmissionItem;
  submissionItemId: Scalars['String'];
};

export type EventSubmissionItem = {
  __typename?: 'EventSubmissionItem';
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['Json']>;
  event?: Maybe<TumiEvent>;
  eventId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  instruction: Scalars['String'];
  name: Scalars['String'];
  ownSubmissions: Array<EventSubmission>;
  required: Scalars['Boolean'];
  responses: Array<Scalars['Json']>;
  submissionTime: SubmissionTime;
  submissions: Array<EventSubmission>;
  type: SubmissionItemType;
};

export type EventSubmissionItemResponsesArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']>;
};

/** Template that holds all information for an event that is needed to run it */
export type EventTemplate = {
  __typename?: 'EventTemplate';
  comment: Scalars['String'];
  coordinates?: Maybe<Scalars['Json']>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  eventInstances: Array<TumiEvent>;
  finances: Scalars['Json'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  location: Scalars['String'];
  organizerText: Scalars['String'];
  participantText: Scalars['String'];
  tenant: Tenant;
  title: Scalars['String'];
};

export type EventTemplateCategory = {
  __typename?: 'EventTemplateCategory';
  createdAt: Scalars['DateTime'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  templates: Array<EventTemplate>;
};

export type Invite = {
  __typename?: 'Invite';
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  redeemedAt?: Maybe<Scalars['DateTime']>;
  redeemedBy?: Maybe<User>;
  redeemerId: Scalars['String'];
  status: MembershipStatus;
  tenant: Tenant;
  tenantId: Scalars['String'];
};

export type LineItem = {
  __typename?: 'LineItem';
  cancellationReason?: Maybe<Scalars['String']>;
  cart?: Maybe<ShoppingCart>;
  cost: Scalars['Decimal'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  pickupTime?: Maybe<Scalars['DateTime']>;
  product: Product;
  productId: Scalars['String'];
  purchase?: Maybe<Purchase>;
  purchaseId?: Maybe<Scalars['String']>;
  quantity: Scalars['Int'];
  shoppingCartId?: Maybe<Scalars['String']>;
  submissions: Array<EventSubmission>;
};

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
  Sponsor = 'SPONSOR',
  Trial = 'TRIAL',
}

export type Mutation = {
  __typename?: 'Mutation';
  addLineItemToBasket?: Maybe<LineItem>;
  /** Adds the user with the supplied id to the event */
  addOrganizerToEvent?: Maybe<TumiEvent>;
  addReceiptToCostItem?: Maybe<CostItem>;
  /** Change the publication state of an event */
  changeEventPublication?: Maybe<TumiEvent>;
  checkInUser?: Maybe<EventRegistration>;
  /** Creates a new event from a given Template */
  createEventFromTemplate?: Maybe<TumiEvent>;
  /** Create a new event organizer */
  createEventOrganizer?: Maybe<EventOrganizer>;
  createEventTemplate?: Maybe<EventTemplate>;
  createInvites?: Maybe<Array<Maybe<Invite>>>;
  createPhotoShare?: Maybe<PhotoShare>;
  createProduct: Product;
  createProductImage?: Maybe<ProductImage>;
  createPurchaseFromCart: Purchase;
  createRegistrationCode: EventRegistrationCode;
  createSubmissionItem: EventSubmissionItem;
  createSubmissionOnEvent: TumiEvent;
  decreaseLineItemQuantity?: Maybe<LineItem>;
  deleteCostItem: TumiEvent;
  deleteLineItem?: Maybe<LineItem>;
  deleteProductImage?: Maybe<ProductImage>;
  deleteReceipt: CostItem;
  deleteSubmissionItem: EventSubmissionItem;
  /** Delete one template by id */
  deleteTemplate?: Maybe<EventTemplate>;
  deregisterFromEvent?: Maybe<TumiEvent>;
  increaseLineItemQuantity?: Maybe<LineItem>;
  registerForEvent: TumiEvent;
  /** Add a new user to the database */
  registerUser: User;
  updateAddress: Purchase;
  updateCostItemsFromTemplate?: Maybe<TumiEvent>;
  updateESNcard?: Maybe<User>;
  updateEventCoreInfo: TumiEvent;
  updateEventGeneralInfo: TumiEvent;
  /** Update an event template */
  updateEventLocation?: Maybe<TumiEvent>;
  updateLeadImage: Product;
  updateProduct: Product;
  updateProfile?: Maybe<User>;
  updatePurchaseStatus: Purchase;
  /** Update an event template */
  updateTemplate?: Maybe<EventTemplate>;
  updateTemplateFinances: EventTemplate;
  /** Update an event template */
  updateTemplateLocation?: Maybe<EventTemplate>;
  updateTenant?: Maybe<Tenant>;
  /** Change the role of s user on the current tenant */
  updateUserRole: User;
  /** Change the status of s user on the current tenant */
  updateUserStatus: User;
  useRegistrationCode: EventRegistrationCode;
  /** Send a verification email to a user (to the current user if no id is provided) */
  verifyEmail: User;
};

export type MutationAddLineItemToBasketArgs = {
  input: AddLineItemToBasketInput;
};

export type MutationAddOrganizerToEventArgs = {
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type MutationAddReceiptToCostItemArgs = {
  costItemId: Scalars['ID'];
  receiptInput: CreateReceiptInput;
};

export type MutationChangeEventPublicationArgs = {
  id: Scalars['ID'];
  state: PublicationState;
};

export type MutationCheckInUserArgs = {
  id: Scalars['ID'];
  manualCheckin?: InputMaybe<Scalars['Boolean']>;
};

export type MutationCreateEventFromTemplateArgs = {
  createEventFromTemplateInput: CreateEventFromTemplateInput;
  templateId: Scalars['ID'];
};

export type MutationCreateEventOrganizerArgs = {
  newOrganizerInput: NewOrganizerInput;
};

export type MutationCreateEventTemplateArgs = {
  eventTemplateInput: CreateEventTemplateInput;
};

export type MutationCreateInvitesArgs = {
  emails: Array<Scalars['String']>;
  status: MembershipStatus;
};

export type MutationCreatePhotoShareArgs = {
  data: CreatePhotoShareInput;
  eventId: Scalars['ID'];
};

export type MutationCreateProductImageArgs = {
  data: CreateProductImageInput;
  productId: Scalars['ID'];
};

export type MutationCreateRegistrationCodeArgs = {
  eventId: Scalars['ID'];
  isPublic?: InputMaybe<Scalars['Boolean']>;
  registrationId?: InputMaybe<Scalars['ID']>;
  sepaAllowed?: InputMaybe<Scalars['Boolean']>;
};

export type MutationCreateSubmissionItemArgs = {
  data: CreateSubmissionItemInput;
  id: Scalars['ID'];
  target?: InputMaybe<Scalars['String']>;
};

export type MutationCreateSubmissionOnEventArgs = {
  data: CreateSubmissionItemInput;
  id: Scalars['ID'];
};

export type MutationDecreaseLineItemQuantityArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteCostItemArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteLineItemArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteProductImageArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteReceiptArgs = {
  costItemId: Scalars['ID'];
  receiptId: Scalars['ID'];
};

export type MutationDeleteSubmissionItemArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTemplateArgs = {
  id: Scalars['ID'];
};

export type MutationDeregisterFromEventArgs = {
  registrationId: Scalars['ID'];
  withRefund?: InputMaybe<Scalars['Boolean']>;
};

export type MutationIncreaseLineItemQuantityArgs = {
  id: Scalars['ID'];
};

export type MutationRegisterForEventArgs = {
  eventId: Scalars['ID'];
  price?: InputMaybe<Scalars['Json']>;
  registrationType?: InputMaybe<RegistrationType>;
  submissions?: InputMaybe<Scalars['Json']>;
};

export type MutationRegisterUserArgs = {
  userInput: CreateUserInput;
};

export type MutationUpdateAddressArgs = {
  address: Scalars['Json'];
  id: Scalars['ID'];
};

export type MutationUpdateCostItemsFromTemplateArgs = {
  eventId: Scalars['ID'];
};

export type MutationUpdateEsNcardArgs = {
  esnCardOverride: Scalars['Boolean'];
  id: Scalars['ID'];
};

export type MutationUpdateEventCoreInfoArgs = {
  data: UpdateCoreEventInput;
  id: Scalars['ID'];
};

export type MutationUpdateEventGeneralInfoArgs = {
  data: UpdateGeneralEventInput;
  id: Scalars['ID'];
};

export type MutationUpdateEventLocationArgs = {
  data: UpdateLocationInput;
  id: Scalars['ID'];
};

export type MutationUpdateLeadImageArgs = {
  id: Scalars['ID'];
  leadImageId: Scalars['ID'];
};

export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
  id: Scalars['ID'];
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationUpdatePurchaseStatusArgs = {
  id: Scalars['ID'];
  status: PurchaseStatus;
};

export type MutationUpdateTemplateArgs = {
  data: UpdateTemplateInput;
  id: Scalars['ID'];
};

export type MutationUpdateTemplateFinancesArgs = {
  finances: Scalars['Json'];
  id: Scalars['ID'];
};

export type MutationUpdateTemplateLocationArgs = {
  data: UpdateLocationInput;
  id: Scalars['ID'];
};

export type MutationUpdateTenantArgs = {
  data: UpdateTenantInput;
  id: Scalars['ID'];
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
  price?: InputMaybe<Scalars['Json']>;
};

export type MutationVerifyEmailArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};

/** Input to create a new Event Organizer */
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
  creatorId: Scalars['String'];
  event: TumiEvent;
  eventId: Scalars['String'];
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
  defaultPrice?: Maybe<Scalars['Decimal']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  images: Array<ProductImage>;
  isActive: Scalars['Boolean'];
  isESNcard: Scalars['Boolean'];
  leadImage?: Maybe<ProductImage>;
  leadImageId?: Maybe<Scalars['String']>;
  lineItems: Array<LineItem>;
  needsShippingAddress: Scalars['Boolean'];
  orderQuantity: Scalars['Int'];
  prices: Scalars['Json'];
  publicationState: PublicationState;
  submissionItems: Array<EventSubmissionItem>;
  submissionOverview?: Maybe<Array<Scalars['Json']>>;
  tenant: Tenant;
  tenantId: Scalars['String'];
  title: Scalars['String'];
  uniSplit: Array<Scalars['Json']>;
};

export type ProductLineItemsArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  container: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['String'];
  id: Scalars['ID'];
  original: Scalars['String'];
  originalBlob: Scalars['String'];
  previewBlob?: Maybe<Scalars['String']>;
  product: Product;
  productId: Scalars['String'];
  src: Scalars['String'];
  type: Scalars['String'];
};

export enum PublicationState {
  Approval = 'APPROVAL',
  Draft = 'DRAFT',
  Organizers = 'ORGANIZERS',
  Public = 'PUBLIC',
}

export type Purchase = {
  __typename?: 'Purchase';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  items: Array<LineItem>;
  payment: StripePayment;
  paymentId: Scalars['String'];
  status: PurchaseStatus;
  user: User;
  userId: Scalars['String'];
};

export enum PurchaseStatus {
  Cancelled = 'CANCELLED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Sent = 'SENT',
}

export type Query = {
  __typename?: 'Query';
  blobUploadKey: Scalars['String'];
  costItem: CostItem;
  costItemsForEvent: Array<CostItem>;
  currentTenant?: Maybe<Tenant>;
  /** Returns the logged in user if found or null */
  currentUser?: Maybe<User>;
  /** Get one event by ID */
  event: TumiEvent;
  eventRegistrationCode?: Maybe<EventRegistrationCode>;
  eventRegistrationCodes: Array<EventRegistrationCode>;
  /** Get one event template by ID */
  eventTemplate?: Maybe<EventTemplate>;
  /** Query event templates for the current tenant */
  eventTemplates: Array<EventTemplate>;
  /** Get a list of all events */
  events: Array<TumiEvent>;
  getPaymentSetupSession: PaymentSetupSession;
  invites?: Maybe<Array<Maybe<Invite>>>;
  lmuPurchases: Array<Purchase>;
  logStats: Array<ActivityLogStat>;
  logs: Array<ActivityLog>;
  /** Retrieve a list of all event organizers */
  organizers: Array<EventOrganizer>;
  photoShareKey: Scalars['String'];
  photos: Array<PhotoShare>;
  photosOfEvent: Array<PhotoShare>;
  product: Product;
  productImageKey: Scalars['String'];
  products: Array<Product>;
  purchase: Purchase;
  purchases: Array<Purchase>;
  registration: EventRegistration;
  registrations: Array<EventRegistration>;
  templateCategories: Array<EventTemplateCategory>;
  templateCategory?: Maybe<EventTemplateCategory>;
  tenants: Array<Tenant>;
  userById?: Maybe<User>;
  userSearchResultNum: Scalars['Int'];
  /** Get all users with a status from the allowList */
  userWithStatus: Array<User>;
  /** returns a list of users */
  users: Array<User>;
};

export type QueryCostItemArgs = {
  id: Scalars['ID'];
};

export type QueryCostItemsForEventArgs = {
  eventId: Scalars['ID'];
};

export type QueryEventArgs = {
  eventId: Scalars['ID'];
};

export type QueryEventRegistrationCodeArgs = {
  id: Scalars['ID'];
};

export type QueryEventRegistrationCodesArgs = {
  includePrivate?: InputMaybe<Scalars['Boolean']>;
};

export type QueryEventTemplateArgs = {
  id: Scalars['ID'];
};

export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type QueryPhotosOfEventArgs = {
  id: Scalars['ID'];
};

export type QueryProductArgs = {
  id: Scalars['ID'];
};

export type QueryProductsArgs = {
  onlyWithOrders?: InputMaybe<Scalars['Boolean']>;
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

export type QueryRegistrationsArgs = {
  statusList?: InputMaybe<Array<RegistrationStatus>>;
};

export type QueryTemplateCategoryArgs = {
  id: Scalars['ID'];
};

export type QueryUserByIdArgs = {
  id: Scalars['ID'];
};

export type QueryUserSearchResultNumArgs = {
  roleList?: InputMaybe<Array<InputMaybe<Role>>>;
  search?: InputMaybe<Scalars['String']>;
  statusList?: InputMaybe<Array<InputMaybe<MembershipStatus>>>;
};

export type QueryUserWithStatusArgs = {
  allowList: Array<MembershipStatus>;
};

export type QueryUsersArgs = {
  onlyWithPurchase?: InputMaybe<Scalars['Boolean']>;
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageLength?: InputMaybe<Scalars['Int']>;
  roleList?: InputMaybe<Array<InputMaybe<Role>>>;
  search?: InputMaybe<Scalars['String']>;
  statusList?: InputMaybe<Array<InputMaybe<MembershipStatus>>>;
};

export type Receipt = {
  __typename?: 'Receipt';
  amount: Scalars['Decimal'];
  blob: Scalars['String'];
  container: Scalars['String'];
  costItem: CostItem;
  costItemId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  md5?: Maybe<Scalars['String']>;
  originalUrl: Scalars['String'];
  preview?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  user: User;
  userId: Scalars['String'];
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

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export type ShoppingCart = {
  __typename?: 'ShoppingCart';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  items: Array<LineItem>;
  userOfTenant: UsersOfTenants;
  usersOfTenantsTenantId: Scalars['String'];
  usersOfTenantsUserId: Scalars['String'];
};

export type StripePayment = {
  __typename?: 'StripePayment';
  amount: Scalars['Decimal'];
  checkoutSession: Scalars['String'];
  createdAt: Scalars['DateTime'];
  eventRegistration?: Maybe<EventRegistration>;
  /** Array of events with their timestamps */
  events: Array<Maybe<Scalars['Json']>>;
  feeAmount?: Maybe<Scalars['Decimal']>;
  id: Scalars['ID'];
  netAmount?: Maybe<Scalars['Decimal']>;
  paymentIntent: Scalars['String'];
  paymentMethod?: Maybe<Scalars['String']>;
  paymentMethodType?: Maybe<Scalars['String']>;
  purchase?: Maybe<Purchase>;
  refundedAmount?: Maybe<Scalars['Decimal']>;
  shipping?: Maybe<Scalars['Json']>;
  status: Scalars['String'];
};

export type StripeUserData = {
  __typename?: 'StripeUserData';
  customerId: Scalars['String'];
  id: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['String']>;
};

export enum SubmissionItemType {
  Boolean = 'BOOLEAN',
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

/** One Tenant of the app, most likely an ESN section */
export type Tenant = {
  __typename?: 'Tenant';
  aboutPage: Scalars['String'];
  createdAt: Scalars['DateTime'];
  faqPage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imprintPage: Scalars['String'];
  name: Scalars['String'];
  privacyPolicyPage: Scalars['String'];
  shortName: Scalars['String'];
  statistics: Statistics;
  tacPage?: Maybe<Scalars['String']>;
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEvent = {
  __typename?: 'TumiEvent';
  activeRegistration?: Maybe<EventRegistration>;
  amountCollected: Scalars['Decimal'];
  coordinates?: Maybe<Scalars['Json']>;
  costItems: Array<CostItem>;
  /** Indicates whether the user could be an organizer for this event */
  couldBeOrganizer: Scalars['Boolean'];
  /** Indicates whether the user could be a participant for this event */
  couldBeParticipant: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  createdBy: User;
  creatorId: Scalars['String'];
  description: Scalars['String'];
  end: Scalars['DateTime'];
  eventOrganizerId: Scalars['String'];
  eventRegistrationCodes: Array<EventRegistrationCode>;
  eventTemplate: EventTemplate;
  eventTemplateId: Scalars['String'];
  feesPaid: Scalars['Decimal'];
  freeParticipantSpots: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  location: Scalars['String'];
  netAmountCollected: Scalars['Decimal'];
  organizer: EventOrganizer;
  organizerLimit: Scalars['Int'];
  /** Indicates whether the current user can register to this event as Organizer */
  organizerRegistrationPossible: Scalars['Boolean'];
  organizerRegistrations: Array<EventRegistration>;
  organizerSignup: Array<MembershipStatus>;
  organizerText: Scalars['String'];
  /** Organizers already on this event */
  organizers: Array<User>;
  /** Number of users registered as organizer to this event */
  organizersRegistered: Scalars['Int'];
  ownRegistrations: Array<EventRegistration>;
  participantLimit: Scalars['Int'];
  /** Indicates whether the current user can register to this event as participant */
  participantRegistrationPossible: Scalars['Json'];
  participantRegistrations: Array<EventRegistration>;
  participantSignup: Array<MembershipStatus>;
  participantText: Scalars['String'];
  /** Number of users that are checked in on the event */
  participantsAttended: Scalars['Int'];
  /** Number of users registered as participant to this event */
  participantsRegistered: Scalars['Int'];
  photoShares: Array<PhotoShare>;
  plannedSpend?: Maybe<Scalars['Decimal']>;
  prices?: Maybe<Scalars['Json']>;
  publicationState: PublicationState;
  registrationLink?: Maybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  registrationStart: Scalars['DateTime'];
  start: Scalars['DateTime'];
  submissionItems: Array<EventSubmissionItem>;
  submittedSpend?: Maybe<Scalars['Decimal']>;
  title: Scalars['String'];
  userIsCreator: Scalars['Boolean'];
  /** Indicates if the current user is organizer for the event */
  userIsOrganizer: Scalars['Boolean'];
  /** Indicates if the current user is registered for the event */
  userRegistered: Scalars['Boolean'];
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEventCostItemsArgs = {
  hideOnInvoice?: InputMaybe<Scalars['Boolean']>;
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEventOwnRegistrationsArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']>;
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEventParticipantRegistrationsArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']>;
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEventSubmissionItemsArgs = {
  submissionTime?: InputMaybe<SubmissionTime>;
};

/** Additional inputs to create an event from a template */
export type UpdateCoreEventInput = {
  end: Scalars['DateTime'];
  eventOrganizerId: Scalars['String'];
  icon: Scalars['String'];
  organizerLimit: Scalars['Int'];
  organizerSignup: Array<MembershipStatus>;
  participantLimit: Scalars['Int'];
  participantSignup: Array<MembershipStatus>;
  prices?: InputMaybe<Scalars['Json']>;
  registrationLink?: InputMaybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  registrationStart: Scalars['DateTime'];
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

/** Additional inputs to create an event from a template */
export type UpdateGeneralEventInput = {
  description: Scalars['String'];
  organizerText: Scalars['String'];
  participantText: Scalars['String'];
};

/** Input to update an event location */
export type UpdateLocationInput = {
  coordinates?: InputMaybe<Scalars['Json']>;
  location: Scalars['String'];
};

export type UpdateProductInput = {
  availability: Array<MembershipStatus>;
  description: Scalars['String'];
  isActive: Scalars['Boolean'];
  needsShippingAddress: Scalars['Boolean'];
  prices: Scalars['Json'];
  publicationState: PublicationState;
  title: Scalars['String'];
};

/** Profile update input object */
export type UpdateProfileInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  university?: InputMaybe<Scalars['String']>;
};

/** Input to update an event template */
export type UpdateTemplateInput = {
  comment: Scalars['String'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  icon: Scalars['String'];
  organizerText: Scalars['String'];
  participantText: Scalars['String'];
  title: Scalars['String'];
};

/** One User of the app */
export type User = {
  __typename?: 'User';
  /** Id from auth0 for this user */
  authId: Scalars['String'];
  birthdate: Scalars['DateTime'];
  calendarToken: Scalars['String'];
  createdAt: Scalars['DateTime'];
  currentTenant: UsersOfTenants;
  email: Scalars['String'];
  email_verified: Scalars['Boolean'];
  esnCardOverride: Scalars['Boolean'];
  eventRegistrations: Array<EventRegistration>;
  firstName: Scalars['String'];
  /** Concatenated name of the user */
  fullName: Scalars['String'];
  hasESNcard: Scalars['Boolean'];
  iban?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  /** List of events organized by the user */
  organizedEvents: Array<TumiEvent>;
  /** List of events attended by the user */
  participatedEvents: Array<TumiEvent>;
  paypal?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  picture: Scalars['String'];
  purchases: Array<Purchase>;
  university?: Maybe<Scalars['String']>;
};

/** One User of the app */
export type UserCurrentTenantArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};

/** One User of the app */
export type UserParticipatedEventsArgs = {
  hideCancelled?: InputMaybe<Scalars['Boolean']>;
};

/** One User of the app */
export type UserPurchasesArgs = {
  skipCancelled?: InputMaybe<Scalars['Boolean']>;
};

export type UsersOfTenants = {
  __typename?: 'UsersOfTenants';
  cart?: Maybe<ShoppingCart>;
  createdAt: Scalars['DateTime'];
  role: Role;
  status: MembershipStatus;
  stripeData?: Maybe<StripeUserData>;
  tenant: Tenant;
  tenantId: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type CheckoutSession = {
  __typename?: 'checkoutSession';
  client_secret?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

export type LineChartSeriesItem = {
  __typename?: 'lineChartSeriesItem';
  name: Scalars['String'];
  value: Scalars['Int'];
};

export type PaymentIntent = {
  __typename?: 'paymentIntent';
  client_secret?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

export type PaymentSetupSession = {
  __typename?: 'paymentSetupSession';
  id: Scalars['String'];
};

export type Statistics = {
  __typename?: 'statistics';
  checkins: Scalars['Int'];
  paidEvents: Scalars['Int'];
  paidRegistrations: Scalars['Int'];
  refundHistory: Array<Scalars['Json']>;
  registrationHistory: Array<Scalars['Json']>;
  registrations: Scalars['Int'];
  totalEvents: Scalars['Int'];
  userEventDistribution: Array<Scalars['Json']>;
  userHistory: Array<Scalars['Json']>;
  userUniversityDistribution: Array<Scalars['Json']>;
  usersRegistered: Scalars['Int'];
  usersRegisteredEvents: Scalars['Int'];
  usersRegisteredFreeEvents: Scalars['Int'];
  usersRegisteredPaidEvents: Scalars['Int'];
  usersWithCustomer: Scalars['Int'];
  usersWithPaymentMethod: Scalars['Int'];
};

export type UpdateTenantInput = {
  aboutPage: Scalars['String'];
  faqPage?: InputMaybe<Scalars['String']>;
  imprintPage: Scalars['String'];
  privacyPolicyPage: Scalars['String'];
  tacPage?: InputMaybe<Scalars['String']>;
};

export type UserHistoryItem = {
  __typename?: 'userHistoryItem';
  name: Scalars['String'];
  series: Array<LineChartSeriesItem>;
};

export type CreateInvitesMutationVariables = Exact<{
  emails: Array<Scalars['String']> | Scalars['String'];
  status: MembershipStatus;
}>;

export type CreateInvitesMutation = {
  __typename?: 'Mutation';
  createInvites?: Array<{
    __typename?: 'Invite';
    id: string;
    email: string;
    status: MembershipStatus;
    createdAt: any;
  } | null> | null;
};

export type GetEventDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetEventDetailsQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    description: string;
    location: string;
    icon: string;
  };
};

export type GetEventListQueryVariables = Exact<{ [key: string]: never }>;

export type GetEventListQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    start: any;
    icon: string;
  }>;
};

export type GetPermissionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPermissionsQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    email: string;
    email_verified: boolean;
    currentTenant: {
      __typename?: 'UsersOfTenants';
      role: Role;
      status: MembershipStatus;
      userId: string;
      tenantId: string;
    };
  } | null;
};

export const CreateInvitesDocument = gql`
  mutation CreateInvites($emails: [String!]!, $status: MembershipStatus!) {
    createInvites(emails: $emails, status: $status) {
      id
      email
      status
      createdAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateInvitesGQL extends Apollo.Mutation<
  CreateInvitesMutation,
  CreateInvitesMutationVariables
> {
  override document = CreateInvitesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventDetailsDocument = gql`
  query getEventDetails($id: ID!) {
    event(eventId: $id) {
      id
      title
      description
      location
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventDetailsGQL extends Apollo.Query<
  GetEventDetailsQuery,
  GetEventDetailsQueryVariables
> {
  override document = GetEventDetailsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventListDocument = gql`
  query getEventList {
    events {
      id
      title
      start
      icon
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventListGQL extends Apollo.Query<
  GetEventListQuery,
  GetEventListQueryVariables
> {
  override document = GetEventListDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPermissionsDocument = gql`
  query getPermissions {
    currentUser {
      id
      email
      email_verified
      currentTenant {
        role
        status
        userId
        tenantId
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPermissionsGQL extends Apollo.Query<
  GetPermissionsQuery,
  GetPermissionsQueryVariables
> {
  override document = GetPermissionsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
