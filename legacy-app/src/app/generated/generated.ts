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
  birthdate?: InputMaybe<Scalars['DateTime']>;
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
  rating?: Maybe<Scalars['Int']>;
  status: RegistrationStatus;
  submissions: Array<EventSubmission>;
  type: RegistrationType;
  user: User;
  userComment?: Maybe<Scalars['String']>;
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
  insuranceDescription: Scalars['String'];
  location: Scalars['String'];
  organizerText: Scalars['String'];
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
  redeemerId?: Maybe<Scalars['String']>;
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
  rateEvent?: Maybe<TumiEvent>;
  registerForEvent: TumiEvent;
  /** Add a new user to the database or update existing */
  registerUser: User;
  removeSubmissionFromEvent: TumiEvent;
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
  useInvite: Invite;
  useRegistrationCode: EventRegistrationCode;
  verifyDCC?: Maybe<Scalars['Json']>;
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


export type MutationRateEventArgs = {
  comment?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  rating: Scalars['Int'];
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


export type MutationRemoveSubmissionFromEventArgs = {
  id: Scalars['ID'];
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


export type MutationUseInviteArgs = {
  id: Scalars['ID'];
};


export type MutationUseRegistrationCodeArgs = {
  id: Scalars['ID'];
  price?: InputMaybe<Scalars['Json']>;
};


export type MutationVerifyDccArgs = {
  certificate: Scalars['String'];
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
  Public = 'PUBLIC'
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
  Sent = 'SENT'
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
  invite?: Maybe<Invite>;
  invites: Array<Invite>;
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
  registrationCount: Scalars['Int'];
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


export type QueryInviteArgs = {
  id: Scalars['ID'];
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


export type QueryRegistrationCountArgs = {
  statusList?: InputMaybe<Array<RegistrationStatus>>;
};


export type QueryRegistrationsArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageLength?: InputMaybe<Scalars['Int']>;
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
  Text = 'TEXT'
}

export enum SubmissionTime {
  After = 'AFTER',
  Before = 'BEFORE',
  During = 'DURING',
  Registration = 'REGISTRATION'
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
  insuranceDescription: Scalars['String'];
  location: Scalars['String'];
  needsRating: Scalars['Boolean'];
  netAmountCollected: Scalars['Decimal'];
  organizer: EventOrganizer;
  organizerLimit: Scalars['Int'];
  organizerRatings?: Maybe<Scalars['Float']>;
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
  participantRatings?: Maybe<Scalars['Float']>;
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
  shouldBeReportedToInsurance: Scalars['Boolean'];
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
  insuranceDescription: Scalars['String'];
  organizerLimit: Scalars['Int'];
  organizerSignup: Array<MembershipStatus>;
  participantLimit: Scalars['Int'];
  participantSignup: Array<MembershipStatus>;
  prices?: InputMaybe<Scalars['Json']>;
  registrationLink?: InputMaybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  registrationStart: Scalars['DateTime'];
  shouldBeReportedToInsurance: Scalars['Boolean'];
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
  insuranceDescription: Scalars['String'];
  organizerText: Scalars['String'];
  participantText: Scalars['String'];
  shouldBeReportedToInsurance: Scalars['Boolean'];
  title: Scalars['String'];
};

/** One User of the app */
export type User = {
  __typename?: 'User';
  /** Id from auth0 for this user */
  authId: Scalars['String'];
  birthdate?: Maybe<Scalars['DateTime']>;
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
  outstandingRating: Scalars['Boolean'];
  /** List of events attended by the user */
  participatedEvents: Array<TumiEvent>;
  paypal?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  picture: Scalars['String'];
  profileComplete: Scalars['Boolean'];
  purchases: Array<Purchase>;
  university?: Maybe<Scalars['String']>;
};


/** One User of the app */
export type UserCurrentTenantArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};


/** One User of the app */
export type UserOrganizedEventsArgs = {
  hideCancelled?: InputMaybe<Scalars['Boolean']>;
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

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, profileComplete: boolean } | null };

export type GetTenantInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantInfoQuery = { __typename?: 'Query', currentTenant?: { __typename?: 'Tenant', id: string, name: string, faqPage?: string | null } | null, currentUser?: { __typename?: 'User', id: string, outstandingRating: boolean } | null };

export type CreateEventTemplateMutationVariables = Exact<{
  input: CreateEventTemplateInput;
}>;


export type CreateEventTemplateMutation = { __typename?: 'Mutation', createEventTemplate?: { __typename?: 'EventTemplate', id: string, createdAt: any } | null };

export type CreateEventFromTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
  eventData: CreateEventFromTemplateInput;
}>;


export type CreateEventFromTemplateMutation = { __typename?: 'Mutation', createEventFromTemplate?: { __typename?: 'TumiEvent', id: string } | null };

export type UpdateTemplateLocationMutationVariables = Exact<{
  templateId: Scalars['ID'];
  update: UpdateLocationInput;
}>;


export type UpdateTemplateLocationMutation = { __typename?: 'Mutation', updateTemplateLocation?: { __typename?: 'EventTemplate', id: string, location: string, coordinates?: any | null } | null };

export type UpdateEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
  update: UpdateTemplateInput;
}>;


export type UpdateEventTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'EventTemplate', id: string, title: string, icon: string, duration: any, description: string, organizerText: string, participantText: string, comment: string, location: string, coordinates?: any | null, insuranceDescription: string, shouldBeReportedToInsurance: boolean } | null };

export type DeleteEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
}>;


export type DeleteEventTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'EventTemplate', id: string } | null };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'EventTemplate', id: string } | null };

export type GetEventTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventTemplatesQuery = { __typename?: 'Query', eventTemplates: Array<{ __typename?: 'EventTemplate', id: string, title: string, icon: string }> };

export type GetEventTemplateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetEventTemplateQuery = { __typename?: 'Query', eventTemplate?: { __typename?: 'EventTemplate', id: string, title: string, icon: string, duration: any, description: string, organizerText: string, participantText: string, comment: string, location: string, coordinates?: any | null, finances: any, insuranceDescription: string, shouldBeReportedToInsurance: boolean, eventInstances: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any }> } | null };

export type UpdateFinancesMutationVariables = Exact<{
  id: Scalars['ID'];
  finances: Scalars['Json'];
}>;


export type UpdateFinancesMutation = { __typename?: 'Mutation', updateTemplateFinances: { __typename?: 'EventTemplate', id: string, finances: any } };

export type GetOrganizerOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizerOptionsQuery = { __typename?: 'Query', organizers: Array<{ __typename?: 'EventOrganizer', id: string, name: string }> };

export type GetCostItemsForEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GetCostItemsForEventQuery = { __typename?: 'Query', costItemsForEvent: Array<{ __typename?: 'CostItem', id: string, name: string, calculationInfo: string, amount: any, onInvoice: boolean, submittedAmount: any }>, event: { __typename?: 'TumiEvent', id: string, eventTemplate: { __typename?: 'EventTemplate', id: string, finances: any } } };

export type UpdateCostItemsFromTemplateMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type UpdateCostItemsFromTemplateMutation = { __typename?: 'Mutation', updateCostItemsFromTemplate?: { __typename?: 'TumiEvent', id: string, costItems: Array<{ __typename?: 'CostItem', id: string, name: string, calculationInfo: string, amount: any, onInvoice: boolean }> } | null };

export type RegisterForEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  type?: InputMaybe<RegistrationType>;
  submissions?: InputMaybe<Scalars['Json']>;
  price?: InputMaybe<Scalars['Json']>;
}>;


export type RegisterForEventMutation = { __typename?: 'Mutation', registerForEvent: { __typename?: 'TumiEvent', id: string, organizerRegistrationPossible: boolean, participantRegistrationPossible: any, organizersRegistered: number, participantsRegistered: number, couldBeOrganizer: boolean, userRegistered: boolean, activeRegistration?: { __typename?: 'EventRegistration', id: string, type: RegistrationType, status: RegistrationStatus, cancellationReason?: string | null, payment?: { __typename?: 'StripePayment', id: string, createdAt: any, amount: any, status: string, checkoutSession: string, paymentIntent: string } | null } | null, organizers: Array<{ __typename?: 'User', fullName: string }> } };

export type LoadEventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, hasESNcard: boolean, university?: string | null } | null, event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, registrationStart: any, publicationState: PublicationState, description: string, organizerText: string, participantText: string, registrationMode: RegistrationMode, registrationLink?: string | null, freeParticipantSpots: string, prices?: any | null, location: string, coordinates?: any | null, organizerSignup: Array<MembershipStatus>, participantSignup: Array<MembershipStatus>, organizerRegistrationPossible: boolean, participantRegistrationPossible: any, userRegistered: boolean, userIsOrganizer: boolean, userIsCreator: boolean, participantLimit: number, participantsRegistered: number, couldBeOrganizer: boolean, couldBeParticipant: boolean, createdBy: { __typename?: 'User', id: string, fullName: string }, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string, name: string, submissionTime: SubmissionTime, instruction: string, required: boolean, type: SubmissionItemType, data?: any | null, ownSubmissions: Array<{ __typename?: 'EventSubmission', id: string, data: any }> }>, organizer: { __typename?: 'EventOrganizer', id: string, link?: string | null, text: string }, activeRegistration?: { __typename?: 'EventRegistration', id: string, didAttend: boolean, status: RegistrationStatus, paymentId?: string | null, payment?: { __typename?: 'StripePayment', id: string, createdAt: any, amount: any, status: string, paymentIntent: string, checkoutSession: string } | null, user: { __typename?: 'User', id: string, fullName: string } } | null, organizers: Array<{ __typename?: 'User', id: string, fullName: string, phone?: string | null }> } };

export type LoadRegistrationForMoveQueryVariables = Exact<{
  registrationId: Scalars['ID'];
}>;


export type LoadRegistrationForMoveQuery = { __typename?: 'Query', registration: { __typename?: 'EventRegistration', id: string, eventId: string, deletingCode?: { __typename?: 'EventRegistrationCode', id: string } | null } };

export type VerifyCertificateMutationVariables = Exact<{
  cert: Scalars['String'];
}>;


export type VerifyCertificateMutation = { __typename?: 'Mutation', verifyDCC?: any | null };

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


export type LoadEventForRunningQuery = { __typename?: 'Query', event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, participantLimit: number, participantsRegistered: number, participantsAttended: number, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, checkInTime?: any | null, user: { __typename?: 'User', id: string, fullName: string, phone?: string | null, picture: string, email: string } }>, costItems: Array<{ __typename?: 'CostItem', id: string, amount: any, actualAmount?: any | null, submittedAmount: any, name: string, receipts: Array<{ __typename?: 'Receipt', id: string }> }>, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, checkInTime?: any | null, payment?: { __typename?: 'StripePayment', id: string, status: string } | null, submissions: Array<{ __typename?: 'EventSubmission', id: string, data: any, submissionItem: { __typename?: 'EventSubmissionItem', id: string, name: string } }>, user: { __typename?: 'User', id: string, fullName: string, phone?: string | null, picture: string, email: string } }> } };

export type GetCostItemQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCostItemQuery = { __typename?: 'Query', costItem: { __typename?: 'CostItem', id: string, name: string, amount: any, submittedAmount: any, event: { __typename?: 'TumiEvent', id: string, title: string }, receipts: Array<{ __typename?: 'Receipt', id: string, amount: any, url: string, type?: string | null, originalUrl: string, user: { __typename?: 'User', id: string, fullName: string } }> } };

export type GetBlobTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBlobTokenQuery = { __typename?: 'Query', blobUploadKey: string };

export type AddReceiptMutationVariables = Exact<{
  costItemId: Scalars['ID'];
  receiptInput: CreateReceiptInput;
}>;


export type AddReceiptMutation = { __typename?: 'Mutation', addReceiptToCostItem?: { __typename?: 'CostItem', id: string, receipts: Array<{ __typename?: 'Receipt', id: string, amount: any, url: string }> } | null };

export type DeleteReceiptMutationVariables = Exact<{
  costItemId: Scalars['ID'];
  receiptId: Scalars['ID'];
}>;


export type DeleteReceiptMutation = { __typename?: 'Mutation', deleteReceipt: { __typename?: 'CostItem', id: string, receipts: Array<{ __typename?: 'Receipt', id: string }> } };

export type GetRegistrationQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRegistrationQuery = { __typename?: 'Query', registration: { __typename?: 'EventRegistration', id: string, type: RegistrationType, didAttend: boolean, checkInTime?: any | null, payment?: { __typename?: 'StripePayment', id: string, status: string } | null, event: { __typename?: 'TumiEvent', id: string, title: string, icon: string }, user: { __typename?: 'User', id: string, fullName: string, picture: string } } };

export type CheckInUserMutationVariables = Exact<{
  id: Scalars['ID'];
  manual?: InputMaybe<Scalars['Boolean']>;
}>;


export type CheckInUserMutation = { __typename?: 'Mutation', checkInUser?: { __typename?: 'EventRegistration', id: string, checkInTime?: any | null, didAttend: boolean } | null };

export type LoadEventForManagementQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventForManagementQuery = { __typename?: 'Query', event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, amountCollected: any, netAmountCollected: any, feesPaid: any, plannedSpend?: any | null, submittedSpend?: any | null, participantLimit: number, participantsRegistered: number, participantsAttended: number, costItems: Array<{ __typename?: 'CostItem', id: string, name: string, submittedAmount: any, amount: any }>, eventRegistrationCodes: Array<{ __typename?: 'EventRegistrationCode', id: string, isPublic: boolean, status: RegistrationStatus, registrationToRemoveId?: string | null, registrationCreatedId?: string | null }>, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, user: { __typename?: 'User', id: string, fullName: string, picture: string, email: string, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus } } }>, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, checkInTime?: any | null, didAttend: boolean, payment?: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, netAmount?: any | null } | null, submissions: Array<{ __typename?: 'EventSubmission', id: string, data: any, submissionItem: { __typename?: 'EventSubmissionItem', id: string, name: string } }>, user: { __typename?: 'User', id: string, fullName: string, picture: string, email: string, phone?: string | null, university?: string | null, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus } } }> } };

export type GetUserPaymentStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserPaymentStatusQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, stripeData?: { __typename?: 'StripeUserData', id: string, paymentMethodId?: string | null } | null } } | null };

export type DeregisterFromEventMutationVariables = Exact<{
  registrationId: Scalars['ID'];
  withRefund?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeregisterFromEventMutation = { __typename?: 'Mutation', deregisterFromEvent?: { __typename?: 'TumiEvent', id: string, participantsRegistered: number, userRegistered: boolean, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string }>, activeRegistration?: { __typename?: 'EventRegistration', id: string } | null, organizers: Array<{ __typename?: 'User', id: string, fullName: string, picture: string }> } | null };

export type LoadUsersByStatusQueryVariables = Exact<{
  allowList: Array<MembershipStatus> | MembershipStatus;
}>;


export type LoadUsersByStatusQuery = { __typename?: 'Query', userWithStatus: Array<{ __typename?: 'User', id: string, fullName: string }> };

export type EventListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
}>;


export type EventListQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, registrationStart: any, prices?: any | null, freeParticipantSpots: string, organizerLimit: number, organizersRegistered: number, couldBeOrganizer: boolean, publicationState: PublicationState, registrationMode: RegistrationMode, userRegistered: boolean, userIsOrganizer: boolean }> };

export type LoadEventForEditQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadEventForEditQuery = { __typename?: 'Query', event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, registrationStart: any, description: string, location: string, coordinates?: any | null, organizerText: string, participantText: string, registrationMode: RegistrationMode, prices?: any | null, eventOrganizerId: string, organizerSignup: Array<MembershipStatus>, participantSignup: Array<MembershipStatus>, organizerRegistrationPossible: boolean, couldBeOrganizer: boolean, couldBeParticipant: boolean, participantLimit: number, organizerLimit: number, publicationState: PublicationState, registrationLink?: string | null, insuranceDescription: string, shouldBeReportedToInsurance: boolean, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string, createdAt: any, required: boolean, submissionTime: SubmissionTime, type: SubmissionItemType, instruction: string, name: string, data?: any | null }>, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, user: { __typename?: 'User', picture: string, fullName: string } }>, organizers: Array<{ __typename?: 'User', fullName: string, picture: string, id: string }> }, currentUser?: { __typename?: 'User', id: string, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } } | null, organizers: Array<{ __typename?: 'EventOrganizer', id: string, name: string }> };

export type AddOrganizerToEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type AddOrganizerToEventMutation = { __typename?: 'Mutation', addOrganizerToEvent?: { __typename?: 'TumiEvent', id: string, organizers: Array<{ __typename?: 'User', fullName: string, picture: string, id: string }> } | null };

export type UpdateGeneralEventMutationVariables = Exact<{
  id: Scalars['ID'];
  data: UpdateGeneralEventInput;
}>;


export type UpdateGeneralEventMutation = { __typename?: 'Mutation', updateEventGeneralInfo: { __typename?: 'TumiEvent', id: string, description: string, organizerText: string, participantText: string } };

export type UpdateCoreEventMutationVariables = Exact<{
  id: Scalars['ID'];
  data: UpdateCoreEventInput;
}>;


export type UpdateCoreEventMutation = { __typename?: 'Mutation', updateEventCoreInfo: { __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, registrationStart: any, prices?: any | null, registrationMode: RegistrationMode, registrationLink?: string | null, eventOrganizerId: string, organizerSignup: Array<MembershipStatus>, participantSignup: Array<MembershipStatus>, participantLimit: number, organizerLimit: number } };

export type UpdatePublicationMutationVariables = Exact<{
  id: Scalars['ID'];
  state: PublicationState;
}>;


export type UpdatePublicationMutation = { __typename?: 'Mutation', changeEventPublication?: { __typename?: 'TumiEvent', id: string, publicationState: PublicationState } | null };

export type UpdateEventLocationMutationVariables = Exact<{
  eventId: Scalars['ID'];
  update: UpdateLocationInput;
}>;


export type UpdateEventLocationMutation = { __typename?: 'Mutation', updateEventLocation?: { __typename?: 'TumiEvent', id: string, location: string, coordinates?: any | null } | null };

export type AddSubmissionToEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  submissionItem: CreateSubmissionItemInput;
}>;


export type AddSubmissionToEventMutation = { __typename?: 'Mutation', createSubmissionOnEvent: { __typename?: 'TumiEvent', id: string, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string, createdAt: any, required: boolean, submissionTime: SubmissionTime, type: SubmissionItemType, instruction: string, name: string }> } };

export type RemoveSubmissionFromEventMutationVariables = Exact<{
  submissionItemId: Scalars['ID'];
}>;


export type RemoveSubmissionFromEventMutation = { __typename?: 'Mutation', removeSubmissionFromEvent: { __typename?: 'TumiEvent', id: string, submissionItems: Array<{ __typename?: 'EventSubmissionItem', id: string, createdAt: any, required: boolean, submissionTime: SubmissionTime, type: SubmissionItemType, instruction: string, name: string }> } };

export type GetPhotosOfEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GetPhotosOfEventQuery = { __typename?: 'Query', photosOfEvent: Array<{ __typename?: 'PhotoShare', id: string, cols: number, rows: number, src: string, original: string, originalBlob: string, type: string, creator: { __typename?: 'User', id: string, fullName: string }, event: { __typename?: 'TumiEvent', id: string, title: string } }>, event: { __typename?: 'TumiEvent', id: string, title: string } };

export type GetPhotoShareKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPhotoShareKeyQuery = { __typename?: 'Query', photoShareKey: string };

export type CreatePhotoShareMutationVariables = Exact<{
  data: CreatePhotoShareInput;
  eventId: Scalars['ID'];
}>;


export type CreatePhotoShareMutation = { __typename?: 'Mutation', createPhotoShare?: { __typename?: 'PhotoShare', id: string } | null };

export type GetHomePageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHomePageDataQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any }>, currentUser?: { __typename?: 'User', id: string } | null };

export type LoadPagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadPagesQuery = { __typename?: 'Query', currentTenant?: { __typename?: 'Tenant', id: string, name: string, imprintPage: string, privacyPolicyPage: string, faqPage?: string | null, aboutPage: string, tacPage?: string | null } | null };

export type RegisterUserMutationVariables = Exact<{
  userInput: CreateUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'User', id: string } };

export type GetPaymentSetupSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentSetupSessionQuery = { __typename?: 'Query', getPaymentSetupSession: { __typename?: 'paymentSetupSession', id: string } };

export type GetPhotoJourneyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPhotoJourneyQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', eventRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus, event: { __typename?: 'TumiEvent', id: string, title: string, icon: string, location: string, start: any, photoShares: Array<{ __typename?: 'PhotoShare', id: string, type: string, src: string, original: string, originalBlob: string, container: string, cols: number, rows: number }> } }> } | null };

export type UserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProfileQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, picture: string, email_verified: boolean, email: string, phone?: string | null, university?: string | null, iban?: string | null, paypal?: string | null, birthdate?: any | null, firstName: string, lastName: string, calendarToken: string, hasESNcard: boolean, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus, stripeData?: { __typename?: 'StripeUserData', paymentMethodId?: string | null } | null }, organizedEvents: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, needsRating: boolean, userIsOrganizer: boolean }>, participatedEvents: Array<{ __typename?: 'TumiEvent', id: string, title: string, icon: string, start: any, end: any, needsRating: boolean, userIsOrganizer: boolean }> } | null };

export type GetRegistrationCodeInfoQueryVariables = Exact<{
  code: Scalars['ID'];
}>;


export type GetRegistrationCodeInfoQuery = { __typename?: 'Query', eventRegistrationCode?: { __typename?: 'EventRegistrationCode', id: string, status: RegistrationStatus, registrationCreated?: { __typename?: 'EventRegistration', id: string, belongsToCurrentUser: boolean, payment?: { __typename?: 'StripePayment', id: string, status: string, checkoutSession: string } | null } | null, targetEvent: { __typename?: 'TumiEvent', id: string, registrationMode: RegistrationMode, title: string, start: any, prices?: any | null } } | null };

export type SubmitEventFeedbackMutationVariables = Exact<{
  id: Scalars['ID'];
  rating: Scalars['Int'];
  comment?: InputMaybe<Scalars['String']>;
}>;


export type SubmitEventFeedbackMutation = { __typename?: 'Mutation', rateEvent?: { __typename?: 'TumiEvent', id: string, needsRating: boolean } | null };

export type UseRegistrationCodeMutationVariables = Exact<{
  id: Scalars['ID'];
  price?: InputMaybe<Scalars['Json']>;
}>;


export type UseRegistrationCodeMutation = { __typename?: 'Mutation', useRegistrationCode: { __typename?: 'EventRegistrationCode', id: string, status: RegistrationStatus, registrationCreated?: { __typename?: 'EventRegistration', id: string, belongsToCurrentUser: boolean, payment?: { __typename?: 'StripePayment', id: string, status: string, checkoutSession: string } | null } | null, targetEvent: { __typename?: 'TumiEvent', id: string, registrationMode: RegistrationMode, title: string, start: any, prices?: any | null } } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'User', id: string, firstName: string, lastName: string, fullName: string, university?: string | null, phone?: string | null } | null };

export type UserRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserRolesQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, hasESNcard: boolean, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } } | null };

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


export type GetRegistrationsQuery = { __typename?: 'Query', registrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, type: RegistrationType, event: { __typename?: 'TumiEvent', title: string, id: string }, user: { __typename?: 'User', id: string, fullName: string }, payment?: { __typename?: 'StripePayment', id: string, status: string, netAmount?: any | null } | null }> };

export type GetRegistrationForAdminQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRegistrationForAdminQuery = { __typename?: 'Query', registration: { __typename?: 'EventRegistration', id: string, createdAt: any, type: RegistrationType, status: RegistrationStatus, cancellationReason?: string | null, event: { __typename?: 'TumiEvent', title: string, id: string, start: any, end: any }, user: { __typename?: 'User', id: string, fullName: string }, payment?: { __typename?: 'StripePayment', id: string, status: string, netAmount?: any | null, paymentIntent: string, paymentMethodType?: string | null, events: Array<any | null> } | null } };

export type GetRegistrationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRegistrationCountQuery = { __typename?: 'Query', registrationCount: number };

export type GetCancelledRegistrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCancelledRegistrationsQuery = { __typename?: 'Query', registrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, cancellationReason?: string | null, event: { __typename?: 'TumiEvent', title: string, id: string }, user: { __typename?: 'User', id: string, fullName: string } }> };

export type GetEventRegistrationCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventRegistrationCodesQuery = { __typename?: 'Query', eventRegistrationCodes: Array<{ __typename?: 'EventRegistrationCode', id: string, createdAt: any, isPublic: boolean, status: RegistrationStatus, targetEvent: { __typename?: 'TumiEvent', id: string, title: string }, creator: { __typename?: 'User', id: string, fullName: string }, registrationToRemove?: { __typename?: 'EventRegistration', id: string } | null, registrationCreated?: { __typename?: 'EventRegistration', id: string, createdAt: any, user: { __typename?: 'User', id: string, fullName: string } } | null }> };

export type GetEventRegistrationCodeQueryVariables = Exact<{
  registrationId: Scalars['ID'];
}>;


export type GetEventRegistrationCodeQuery = { __typename?: 'Query', eventRegistrationCode?: { __typename?: 'EventRegistrationCode', id: string, createdAt: any, isPublic: boolean, status: RegistrationStatus, sepaAllowed: boolean, targetEvent: { __typename?: 'TumiEvent', id: string, title: string, start: any, end: any }, creator: { __typename?: 'User', id: string, email: string, fullName: string }, connectedRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, user: { __typename?: 'User', id: string, fullName: string }, payment?: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, paymentIntent: string, events: Array<any | null> } | null }>, registrationToRemove?: { __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, user: { __typename?: 'User', id: string, fullName: string }, payment?: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, paymentIntent: string, events: Array<any | null> } | null } | null, registrationCreated?: { __typename?: 'EventRegistration', id: string, createdAt: any, status: RegistrationStatus, cancellationReason?: string | null, user: { __typename?: 'User', id: string, fullName: string }, payment?: { __typename?: 'StripePayment', id: string, status: string, paymentIntent: string, paymentMethodType?: string | null, events: Array<any | null> } | null } | null } | null };

export type CreateOrganizerMutationVariables = Exact<{
  input: NewOrganizerInput;
}>;


export type CreateOrganizerMutation = { __typename?: 'Mutation', createEventOrganizer?: { __typename?: 'EventOrganizer', id: string } | null };

export type LoadEventsForInsuranceQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadEventsForInsuranceQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any, shouldBeReportedToInsurance: boolean, insuranceDescription: string, organizerLimit: number, participantLimit: number, publicationState: PublicationState, organizer: { __typename?: 'EventOrganizer', id: string, name: string } }> };

export type LoadEventsWithBookingQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
}>;


export type LoadEventsWithBookingQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any, icon: string, registrationMode: RegistrationMode, registrationStart: any, participantLimit: number, participantsRegistered: number, organizer: { __typename?: 'EventOrganizer', id: string, name: string } }> };

export type LoadEventsWithRatingQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
}>;


export type LoadEventsWithRatingQuery = { __typename?: 'Query', events: Array<{ __typename?: 'TumiEvent', id: string, title: string, start: any, icon: string, participantRatings?: number | null, organizerRatings?: number | null, participantRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus, rating?: number | null, userComment?: string | null }>, organizerRegistrations: Array<{ __typename?: 'EventRegistration', id: string, status: RegistrationStatus, rating?: number | null, userComment?: string | null }>, organizer: { __typename?: 'EventOrganizer', id: string, name: string } }> };

export type LoadAllPhotosQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadAllPhotosQuery = { __typename?: 'Query', photos: Array<{ __typename?: 'PhotoShare', id: string, cols: number, rows: number, src: string, original: string, originalBlob: string, type: string, event: { __typename?: 'TumiEvent', id: string, title: string }, creator: { __typename?: 'User', id: string, fullName: string } }> };

export type LoadUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadUserQuery = { __typename?: 'Query', userById?: { __typename?: 'User', id: string, authId: string, firstName: string, lastName: string, fullName: string, email: string, birthdate?: any | null, phone?: string | null, university?: string | null, hasESNcard: boolean, esnCardOverride: boolean, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus }, eventRegistrations: Array<{ __typename?: 'EventRegistration', id: string, createdAt: any, checkInTime?: any | null, type: RegistrationType, status: RegistrationStatus, deletingCode?: { __typename?: 'EventRegistrationCode', id: string, createdAt: any } | null, creatingCode?: { __typename?: 'EventRegistrationCode', id: string, createdAt: any } | null, payment?: { __typename?: 'StripePayment', id: string, status: string, events: Array<any | null> } | null, event: { __typename?: 'TumiEvent', id: string, title: string, start: any, end: any } }> } | null };

export type GetTenantForEditQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantForEditQuery = { __typename?: 'Query', currentTenant?: { __typename?: 'Tenant', id: string, name: string, imprintPage: string, aboutPage: string, privacyPolicyPage: string, faqPage?: string | null, tacPage?: string | null } | null };

export type GetOrganizersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizersQuery = { __typename?: 'Query', organizers: Array<{ __typename?: 'EventOrganizer', id: string, name: string, text: string }> };

export type GetUsersQueryVariables = Exact<{
  roleList?: InputMaybe<Array<InputMaybe<Role>> | InputMaybe<Role>>;
  statusList?: InputMaybe<Array<InputMaybe<MembershipStatus>> | InputMaybe<MembershipStatus>>;
  search?: InputMaybe<Scalars['String']>;
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageLength?: InputMaybe<Scalars['Int']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', userSearchResultNum: number, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role, status: MembershipStatus } }> };

export type GetStatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatisticsQuery = { __typename?: 'Query', currentTenant?: { __typename?: 'Tenant', id: string, name: string, statistics: { __typename?: 'statistics', usersRegistered: number, usersWithCustomer: number, usersWithPaymentMethod: number, registrations: number, userHistory: Array<any>, registrationHistory: Array<any>, refundHistory: Array<any>, userEventDistribution: Array<any>, usersRegisteredEvents: number, usersRegisteredFreeEvents: number, usersRegisteredPaidEvents: number, checkins: number, paidRegistrations: number, totalEvents: number, paidEvents: number, userUniversityDistribution: Array<any> } } | null };

export type GetLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLogsQuery = { __typename?: 'Query', logs: Array<{ __typename?: 'ActivityLog', id: string, createdAt: any, message: string, severity: LogSeverity, data?: any | null, oldData?: any | null }>, logStats: Array<{ __typename?: 'ActivityLogStat', count: number, message: string }> };

export type GetTenantPurchasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantPurchasesQuery = { __typename?: 'Query', purchases: Array<{ __typename?: 'Purchase', id: string, createdAt: any, status: PurchaseStatus, user: { __typename?: 'User', id: string, email: string, fullName: string, university?: string | null }, payment: { __typename?: 'StripePayment', id: string, status: string, amount: any } }> };

export type GetPurchaseQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPurchaseQuery = { __typename?: 'Query', purchase: { __typename?: 'Purchase', id: string, status: PurchaseStatus, createdAt: any, user: { __typename?: 'User', id: string, email: string, fullName: string, university?: string | null }, payment: { __typename?: 'StripePayment', id: string, status: string, paymentMethodType?: string | null, events: Array<any | null>, shipping?: any | null, amount: any, netAmount?: any | null, feeAmount?: any | null }, items: Array<{ __typename?: 'LineItem', id: string, quantity: number, product: { __typename?: 'Product', id: string, title: string, leadImage?: { __typename?: 'ProductImage', id: string, src: string } | null }, submissions: Array<{ __typename?: 'EventSubmission', id: string, data: any, submissionItem: { __typename?: 'EventSubmissionItem', id: string, name: string } }> }> } };

export type UpdateTenantMutationVariables = Exact<{
  id: Scalars['ID'];
  update: UpdateTenantInput;
}>;


export type UpdateTenantMutation = { __typename?: 'Mutation', updateTenant?: { __typename?: 'Tenant', id: string, faqPage?: string | null, imprintPage: string, privacyPolicyPage: string, aboutPage: string, tacPage?: string | null } | null };

export type UpdateEsNcardMutationVariables = Exact<{
  userId: Scalars['ID'];
  override: Scalars['Boolean'];
}>;


export type UpdateEsNcardMutation = { __typename?: 'Mutation', updateESNcard?: { __typename?: 'User', id: string, esnCardOverride: boolean, hasESNcard: boolean } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  role: Role;
  status: MembershipStatus;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUserRole: { __typename?: 'User', id: string, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, role: Role } }, updateUserStatus: { __typename?: 'User', id: string, currentTenant: { __typename?: 'UsersOfTenants', userId: string, tenantId: string, status: MembershipStatus } } };

export const GetCurrentUserDocument = gql`
    query getCurrentUser {
  currentUser {
    id
    profileComplete
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
  createEventTemplate(eventTemplateInput: $input) {
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
  createEventFromTemplate(
    templateId: $templateId
    createEventFromTemplateInput: $eventData
  ) {
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
    mutation updateTemplateLocation($templateId: ID!, $update: UpdateLocationInput!) {
  updateTemplateLocation(id: $templateId, data: $update) {
    id
    location
    coordinates
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
export const UpdateEventTemplateDocument = gql`
    mutation updateEventTemplate($templateId: ID!, $update: UpdateTemplateInput!) {
  updateTemplate(id: $templateId, data: $update) {
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
  deleteTemplate(id: $templateId) {
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
  deleteTemplate(id: $id) {
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
    finances
    insuranceDescription
    shouldBeReportedToInsurance
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
    mutation updateFinances($id: ID!, $finances: Json!) {
  updateTemplateFinances(id: $id, finances: $finances) {
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
  organizers {
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
  costItemsForEvent(eventId: $eventId) {
    id
    name
    calculationInfo
    amount
    onInvoice
    submittedAmount
  }
  event(eventId: $eventId) {
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
    mutation registerForEvent($eventId: ID!, $type: RegistrationType, $submissions: Json, $price: Json) {
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
    participantsRegistered
    couldBeOrganizer
    userRegistered
    activeRegistration {
      id
      type
      status
      cancellationReason
      payment {
        id
        createdAt
        amount
        status
        checkoutSession
        paymentIntent
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
    hasESNcard
    university
  }
  event(eventId: $id) {
    id
    title
    icon
    start
    end
    registrationStart
    publicationState
    description
    organizerText
    participantText
    registrationMode
    registrationLink
    freeParticipantSpots
    prices
    location
    coordinates
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
      paymentId
      payment {
        id
        createdAt
        amount
        status
        paymentIntent
        checkoutSession
      }
      user {
        id
        fullName
      }
    }
    organizerSignup
    participantSignup
    organizerRegistrationPossible
    participantRegistrationPossible
    userRegistered
    userIsOrganizer
    userIsCreator
    participantLimit
    participantsRegistered
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
  verifyDCC(certificate: $cert)
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
  event(eventId: $id) {
    id
    title
    icon
    start
    end
    participantLimit
    participantsRegistered
    participantsAttended
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
      payment {
        id
        status
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
  addReceiptToCostItem(costItemId: $costItemId, receiptInput: $receiptInput) {
    id
    receipts {
      id
      amount
      url
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
    mutation deleteReceipt($costItemId: ID!, $receiptId: ID!) {
  deleteReceipt(costItemId: $costItemId, receiptId: $receiptId) {
    id
    receipts {
      id
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
    payment {
      id
      status
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
  checkInUser(id: $id, manualCheckin: $manual) {
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
  event(eventId: $id) {
    id
    title
    icon
    start
    amountCollected
    netAmountCollected
    feesPaid
    plannedSpend
    submittedSpend
    participantLimit
    participantsRegistered
    participantsAttended
    costItems {
      id
      name
      submittedAmount
      amount
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
      payment {
        id
        status
        paymentMethodType
        netAmount
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
    }
    activeRegistration {
      id
    }
    organizers {
      id
      fullName
      picture
    }
    participantsRegistered
    userRegistered
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
  userWithStatus(allowList: $allowList) {
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
    query eventList($after: DateTime) {
  events(after: $after) {
    id
    title
    icon
    start
    registrationStart
    prices
    freeParticipantSpots
    organizerLimit
    organizersRegistered
    couldBeOrganizer
    publicationState
    registrationMode
    userRegistered
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
  event(eventId: $id) {
    id
    title
    icon
    start
    end
    registrationStart
    description
    location
    coordinates
    organizerText
    participantText
    registrationMode
    prices
    eventOrganizerId
    organizerSignup
    participantSignup
    organizerRegistrationPossible
    couldBeOrganizer
    couldBeParticipant
    participantLimit
    organizerLimit
    publicationState
    registrationLink
    insuranceDescription
    shouldBeReportedToInsurance
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
  organizers {
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
  updateEventGeneralInfo(id: $id, data: $data) {
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
  updateEventCoreInfo(id: $id, data: $data) {
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
  changeEventPublication(id: $id, state: $state) {
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
    mutation updateEventLocation($eventId: ID!, $update: UpdateLocationInput!) {
  updateEventLocation(id: $eventId, data: $update) {
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
  createSubmissionOnEvent(id: $eventId, data: $submissionItem) {
    id
    submissionItems {
      id
      createdAt
      required
      submissionTime
      type
      instruction
      name
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
  removeSubmissionFromEvent(id: $submissionItemId) {
    id
    submissionItems {
      id
      createdAt
      required
      submissionTime
      type
      instruction
      name
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
  photosOfEvent(id: $eventId) {
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
  event(eventId: $eventId) {
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
  createPhotoShare(data: $data, eventId: $eventId) {
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
  registerUser(userInput: $userInput) {
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
export const GetPaymentSetupSessionDocument = gql`
    query getPaymentSetupSession {
  getPaymentSetupSession {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPaymentSetupSessionGQL extends Apollo.Query<GetPaymentSetupSessionQuery, GetPaymentSetupSessionQueryVariables> {
    override document = GetPaymentSetupSessionDocument;
    
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
    email_verified
    email
    phone
    university
    iban
    paypal
    birthdate
    firstName
    lastName
    calendarToken
    hasESNcard
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
      payment {
        id
        status
        checkoutSession
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
    mutation useRegistrationCode($id: ID!, $price: Json) {
  useRegistrationCode(id: $id, price: $price) {
    id
    status
    registrationCreated {
      id
      belongsToCurrentUser
      payment {
        id
        status
        checkoutSession
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
    mutation updateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    firstName
    lastName
    fullName
    university
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
    hasESNcard
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
  createSubmissionItem(id: $id, data: $input, target: $target) {
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
    payment {
      id
      status
      netAmount
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
    payment {
      id
      status
      netAmount
      paymentIntent
      paymentMethodType
      events
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
  eventRegistrationCodes(includePrivate: true) {
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
      payment {
        id
        status
        paymentMethodType
        paymentIntent
        events
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
      payment {
        id
        status
        paymentMethodType
        paymentIntent
        events
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
      payment {
        id
        status
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
  export class GetEventRegistrationCodeGQL extends Apollo.Query<GetEventRegistrationCodeQuery, GetEventRegistrationCodeQueryVariables> {
    override document = GetEventRegistrationCodeDocument;
    
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
    participantsRegistered
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
  userById(id: $id) {
    id
    authId
    firstName
    lastName
    fullName
    email
    birthdate
    phone
    university
    hasESNcard
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
      payment {
        id
        status
        events
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
  organizers {
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
    query getUsers($roleList: [Role], $statusList: [MembershipStatus], $search: String, $pageIndex: Int, $pageLength: Int) {
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
    query getStatistics {
  currentTenant {
    id
    name
    statistics {
      usersRegistered
      usersWithCustomer
      usersWithPaymentMethod
      registrations
      userHistory
      registrationHistory
      refundHistory
      userEventDistribution
      usersRegisteredEvents
      usersRegisteredFreeEvents
      usersRegisteredPaidEvents
      checkins
      paidRegistrations
      totalEvents
      paidEvents
      userUniversityDistribution
    }
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
    payment {
      id
      status
      amount
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
    payment {
      id
      status
      paymentMethodType
      events
      shipping
      amount
      netAmount
      feeAmount
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
    mutation updateTenant($id: ID!, $update: updateTenantInput!) {
  updateTenant(id: $id, data: $update) {
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
  updateESNcard(id: $userId, esnCardOverride: $override) {
    id
    esnCardOverride
    hasESNcard
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
    id
    currentTenant(userId: $id) {
      userId
      tenantId
      role
    }
  }
  updateUserStatus(userId: $id, status: $status) {
    id
    currentTenant(userId: $id) {
      userId
      tenantId
      status
    }
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