import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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

/** Additional inputs to create an event from a template */
export type CreateEventFromTemplateInput = {
  end: Scalars['DateTime'];
  organizerId?: Maybe<Scalars['ID']>;
  organizerLimit: Scalars['Int'];
  participantLimit: Scalars['Int'];
  price?: Maybe<Scalars['Decimal']>;
  registrationLink?: Maybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  start: Scalars['DateTime'];
};

/** Input needed to create a new event template */
export type CreateEventTemplateInput = {
  comment: Scalars['String'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  icon: Scalars['String'];
  location: Scalars['String'];
  locationId: Scalars['String'];
  organizerText: Scalars['String'];
  participantMail: Scalars['String'];
  participantText: Scalars['String'];
  title: Scalars['String'];
};

/** New user input object */
export type CreateUserInput = {
  birthdate: Scalars['DateTime'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
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
  createdAt: Scalars['DateTime'];
  event: TumiEvent;
  eventId: Scalars['String'];
  id: Scalars['ID'];
  type: RegistrationType;
  user: User;
  userId: Scalars['String'];
};

/** Template that holds all information for an event that is needed to run it */
export type EventTemplate = {
  __typename?: 'EventTemplate';
  comment: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  eventInstances: Array<TumiEvent>;
  finances: Scalars['Json'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  location: Scalars['String'];
  locationId: Scalars['String'];
  organizerText: Scalars['String'];
  participantMail: Scalars['String'];
  participantText: Scalars['String'];
  tenant: Tenant;
  title: Scalars['String'];
};

export enum MembershipStatus {
  Alumni = 'ALUMNI',
  Full = 'FULL',
  None = 'NONE',
  Sponsor = 'SPONSOR',
  Trial = 'TRIAL',
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Adds the user with the supplied id to the event */
  addOrganizerToEvent?: Maybe<TumiEvent>;
  /** Creates a new event from a given Template */
  createEventFromTemplate?: Maybe<TumiEvent>;
  /** Create a new event organizer */
  createEventOrganizer?: Maybe<EventOrganizer>;
  createEventTemplate?: Maybe<EventTemplate>;
  /** Delete one template by id */
  deleteTemplate?: Maybe<EventTemplate>;
  registerForEvent?: Maybe<TumiEvent>;
  /** Add a new user to the database */
  registerUser: User;
  /** Removes the user with the supplied id to the event */
  removeUserFromEvent?: Maybe<TumiEvent>;
  updateEventGeneralInfo: TumiEvent;
  /** Update an event template */
  updateTemplate?: Maybe<EventTemplate>;
  /** Change the role of s user on the current tenant */
  updateUserRole: User;
  /** Change the status of s user on the current tenant */
  updateUserStatus: User;
};

export type MutationAddOrganizerToEventArgs = {
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
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

export type MutationDeleteTemplateArgs = {
  id: Scalars['ID'];
};

export type MutationRegisterForEventArgs = {
  eventId: Scalars['ID'];
  registrationType?: Maybe<RegistrationType>;
};

export type MutationRegisterUserArgs = {
  userInput?: Maybe<CreateUserInput>;
};

export type MutationRemoveUserFromEventArgs = {
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type MutationUpdateEventGeneralInfoArgs = {
  data: UpdateEventInput;
  id: Scalars['ID'];
};

export type MutationUpdateTemplateArgs = {
  data: UpdateTemplateInput;
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

/** Input to create a new Event Organizer */
export type NewOrganizerInput = {
  link?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  text: Scalars['String'];
};

export type PhotoShare = {
  __typename?: 'PhotoShare';
  createdAt: Scalars['DateTime'];
  event: TumiEvent;
  eventId: Scalars['String'];
  id: Scalars['ID'];
};

export enum PublicationState {
  Approval = 'APPROVAL',
  Draft = 'DRAFT',
  Organizers = 'ORGANIZERS',
  Public = 'PUBLIC',
}

export type Query = {
  __typename?: 'Query';
  currentTenant?: Maybe<Tenant>;
  /** Returns the logged in user if found or null */
  currentUser?: Maybe<User>;
  /** Get one event by ID */
  event?: Maybe<TumiEvent>;
  /** Get one event template by ID */
  eventTemplate?: Maybe<EventTemplate>;
  /** Query event templates for the current tenant */
  eventTemplates: Array<EventTemplate>;
  /** Get a list of all events */
  events: Array<TumiEvent>;
  getPaymentSetupSession: PaymentSetupSession;
  /** Retrieve a list of all event organizers */
  organizers: Array<EventOrganizer>;
  tenants: Array<Tenant>;
  userById?: Maybe<User>;
  /** Get all users with a status from the allowList */
  userWithStatus: Array<User>;
  /** returns a list of users */
  users: Array<User>;
};

export type QueryEventArgs = {
  eventId: Scalars['ID'];
};

export type QueryEventTemplateArgs = {
  id: Scalars['ID'];
};

export type QueryUserByIdArgs = {
  id: Scalars['ID'];
};

export type QueryUserWithStatusArgs = {
  allowList: Array<MembershipStatus>;
};

export enum RegistrationMode {
  External = 'EXTERNAL',
  Online = 'ONLINE',
  Stripe = 'STRIPE',
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

export type StripeUserData = {
  __typename?: 'StripeUserData';
  customerId: Scalars['String'];
  id: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['String']>;
};

export enum SubmissionItemType {
  Date = 'DATE',
  File = 'FILE',
  Number = 'NUMBER',
  Rating = 'RATING',
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
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  shortName: Scalars['String'];
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEvent = {
  __typename?: 'TumiEvent';
  /** Indicates whether the user could be an organizer for this event */
  couldBeOrganizer?: Maybe<Scalars['Boolean']>;
  /** Indicates whether the user could be a participant for this event */
  couldBeParticipant?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  createdBy: User;
  description: Scalars['String'];
  end: Scalars['DateTime'];
  eventOrganizerId: Scalars['String'];
  eventTemplate: EventTemplate;
  eventTemplateId: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  location: Scalars['String'];
  locationId: Scalars['String'];
  organizer: EventOrganizer;
  organizerLimit: Scalars['Int'];
  /** Indicates whether the current user can register to this event as Organizer */
  organizerRegistrationPossible?: Maybe<Scalars['Boolean']>;
  organizerSignup: Array<MembershipStatus>;
  organizerText: Scalars['String'];
  /** Organizers alraedy on this event */
  organizers: Array<User>;
  /** Number of users registered as organizer to this event */
  organizersRegistered?: Maybe<Scalars['Int']>;
  participantLimit: Scalars['Int'];
  participantMail: Scalars['String'];
  /** Indicates whether the current user can register to this event as participant */
  participantRegistrationPossible?: Maybe<Scalars['Boolean']>;
  participantSignup: Array<MembershipStatus>;
  participantText: Scalars['String'];
  /** Number of users registered as participant to this event */
  participantsRegistered?: Maybe<Scalars['Int']>;
  photoShare?: Maybe<PhotoShare>;
  price?: Maybe<Scalars['Decimal']>;
  publicationState: PublicationState;
  registrationLink?: Maybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  registrations: Array<EventRegistration>;
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

/** Additional inputs to create an event from a template */
export type UpdateEventInput = {
  description: Scalars['String'];
  end: Scalars['DateTime'];
  eventOrganizerId?: Maybe<Scalars['ID']>;
  icon: Scalars['String'];
  organizerLimit: Scalars['Int'];
  organizerSignup: Array<MembershipStatus>;
  organizerText: Scalars['String'];
  participantLimit: Scalars['Int'];
  participantSignup: Array<MembershipStatus>;
  price?: Maybe<Scalars['Decimal']>;
  registrationLink?: Maybe<Scalars['String']>;
  registrationMode: RegistrationMode;
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

/** Input to update an event template */
export type UpdateTemplateInput = {
  comment: Scalars['String'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  icon: Scalars['String'];
  location: Scalars['String'];
  locationId: Scalars['String'];
  organizerText: Scalars['String'];
  participantMail: Scalars['String'];
  participantText: Scalars['String'];
  title: Scalars['String'];
};

/** One User of the app */
export type User = {
  __typename?: 'User';
  /** Id from auth0 for this user */
  authId: Scalars['String'];
  birthdate: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  currentTenant?: Maybe<UsersOfTenants>;
  email: Scalars['String'];
  email_verified: Scalars['Boolean'];
  firstName: Scalars['String'];
  /** Concatenated name of the user */
  fullName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  /** List of events organized by the user */
  organizedEvents: Array<TumiEvent>;
  /** List of events attended by the user */
  participatedEvents: Array<TumiEvent>;
  picture: Scalars['String'];
};

export type UsersOfTenants = {
  __typename?: 'UsersOfTenants';
  createdAt: Scalars['DateTime'];
  role: Role;
  status: MembershipStatus;
  stripeData?: Maybe<StripeUserData>;
  tenant: Tenant;
  tenantId: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type PaymentSetupSession = {
  __typename?: 'paymentSetupSession';
  id: Scalars['String'];
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
  __typename?: 'Query';
  currentUser?: Maybe<{ __typename?: 'User'; id: string }>;
};

export type UserRolesQueryVariables = Exact<{ [key: string]: never }>;

export type UserRolesQuery = {
  __typename?: 'Query';
  currentUser?: Maybe<{
    __typename?: 'User';
    id: string;
    fullName: string;
    currentTenant?: Maybe<{
      __typename?: 'UsersOfTenants';
      role: Role;
      status: MembershipStatus;
    }>;
  }>;
};

export type CreateEventTemplateMutationVariables = Exact<{
  input: CreateEventTemplateInput;
}>;

export type CreateEventTemplateMutation = {
  __typename?: 'Mutation';
  createEventTemplate?: Maybe<{
    __typename?: 'EventTemplate';
    id: string;
    createdAt: any;
  }>;
};

export type CreateEventFromTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
  eventData: CreateEventFromTemplateInput;
}>;

export type CreateEventFromTemplateMutation = {
  __typename?: 'Mutation';
  createEventFromTemplate?: Maybe<{ __typename?: 'TumiEvent'; id: string }>;
};

export type UpdateEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
  update: UpdateTemplateInput;
}>;

export type UpdateEventTemplateMutation = {
  __typename?: 'Mutation';
  updateTemplate?: Maybe<{
    __typename?: 'EventTemplate';
    id: string;
    title: string;
    icon: string;
    duration: any;
    description: string;
    organizerText: string;
    participantMail: string;
    participantText: string;
    comment: string;
    location: string;
    locationId: string;
  }>;
};

export type DeleteEventTemplateMutationVariables = Exact<{
  templateId: Scalars['ID'];
}>;

export type DeleteEventTemplateMutation = {
  __typename?: 'Mutation';
  deleteTemplate?: Maybe<{ __typename?: 'EventTemplate'; id: string }>;
};

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteTemplateMutation = {
  __typename?: 'Mutation';
  deleteTemplate?: Maybe<{ __typename?: 'EventTemplate'; id: string }>;
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

export type GetEventTemplateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetEventTemplateQuery = {
  __typename?: 'Query';
  eventTemplate?: Maybe<{
    __typename?: 'EventTemplate';
    id: string;
    title: string;
    icon: string;
    duration: any;
    description: string;
    organizerText: string;
    participantMail: string;
    participantText: string;
    comment: string;
    location: string;
    locationId: string;
  }>;
};

export type GetOrganizerOptionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetOrganizerOptionsQuery = {
  __typename?: 'Query';
  organizers: Array<{
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
  }>;
};

export type LoadEventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type LoadEventQuery = {
  __typename?: 'Query';
  event?: Maybe<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: any;
    end: any;
    publicationState: PublicationState;
    description: string;
    organizerText: string;
    registrationMode: RegistrationMode;
    registrationLink?: Maybe<string>;
    price?: Maybe<any>;
    organizerSignup: Array<MembershipStatus>;
    participantSignup: Array<MembershipStatus>;
    organizerRegistrationPossible?: Maybe<boolean>;
    couldBeOrganizer?: Maybe<boolean>;
    couldBeParticipant?: Maybe<boolean>;
    organizer: {
      __typename?: 'EventOrganizer';
      link?: Maybe<string>;
      text: string;
    };
    organizers: Array<{ __typename?: 'User'; fullName: string }>;
  }>;
};

export type LoadEventForEditQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type LoadEventForEditQuery = {
  __typename?: 'Query';
  event?: Maybe<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: any;
    end: any;
    description: string;
    organizerText: string;
    registrationMode: RegistrationMode;
    price?: Maybe<any>;
    eventOrganizerId: string;
    organizerSignup: Array<MembershipStatus>;
    participantSignup: Array<MembershipStatus>;
    organizerRegistrationPossible?: Maybe<boolean>;
    couldBeOrganizer?: Maybe<boolean>;
    couldBeParticipant?: Maybe<boolean>;
    participantLimit: number;
    organizerLimit: number;
    publicationState: PublicationState;
    registrationLink?: Maybe<string>;
    organizers: Array<{
      __typename?: 'User';
      fullName: string;
      picture: string;
      id: string;
    }>;
  }>;
  organizers: Array<{
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
  }>;
};

export type RemoveUserFromEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
}>;

export type RemoveUserFromEventMutation = {
  __typename?: 'Mutation';
  removeUserFromEvent?: Maybe<{
    __typename?: 'TumiEvent';
    id: string;
    organizers: Array<{
      __typename?: 'User';
      id: string;
      fullName: string;
      picture: string;
    }>;
  }>;
};

export type AddOrganizerToEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
}>;

export type AddOrganizerToEventMutation = {
  __typename?: 'Mutation';
  addOrganizerToEvent?: Maybe<{
    __typename?: 'TumiEvent';
    id: string;
    organizers: Array<{
      __typename?: 'User';
      fullName: string;
      picture: string;
      id: string;
    }>;
  }>;
};

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['ID'];
  data: UpdateEventInput;
}>;

export type UpdateEventMutation = {
  __typename?: 'Mutation';
  updateEventGeneralInfo: {
    __typename?: 'TumiEvent';
    title: string;
    icon: string;
    start: any;
    end: any;
    description: string;
    organizerText: string;
    registrationMode: RegistrationMode;
    registrationLink?: Maybe<string>;
    price?: Maybe<any>;
    eventOrganizerId: string;
    organizerSignup: Array<MembershipStatus>;
    participantSignup: Array<MembershipStatus>;
    participantLimit: number;
    organizerLimit: number;
  };
};

export type LoadUsersByStatusQueryVariables = Exact<{
  allowList: Array<MembershipStatus> | MembershipStatus;
}>;

export type LoadUsersByStatusQuery = {
  __typename?: 'Query';
  userWithStatus: Array<{ __typename?: 'User'; id: string; fullName: string }>;
};

export type RegisterForEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  type?: Maybe<RegistrationType>;
}>;

export type RegisterForEventMutation = {
  __typename?: 'Mutation';
  registerForEvent?: Maybe<{
    __typename?: 'TumiEvent';
    id: string;
    organizerRegistrationPossible?: Maybe<boolean>;
    participantRegistrationPossible?: Maybe<boolean>;
    organizersRegistered?: Maybe<number>;
    participantsRegistered?: Maybe<number>;
    couldBeOrganizer?: Maybe<boolean>;
    organizers: Array<{ __typename?: 'User'; fullName: string }>;
  }>;
};

export type EventListQueryVariables = Exact<{ [key: string]: never }>;

export type EventListQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'TumiEvent';
    id: string;
    title: string;
    icon: string;
    start: any;
    participantLimit: number;
    participantsRegistered?: Maybe<number>;
    organizerLimit: number;
    organizersRegistered?: Maybe<number>;
    couldBeOrganizer?: Maybe<boolean>;
    couldBeParticipant?: Maybe<boolean>;
    publicationState: PublicationState;
    registrationMode: RegistrationMode;
  }>;
};

export type RegisterUserMutationVariables = Exact<{
  userInput?: Maybe<CreateUserInput>;
}>;

export type RegisterUserMutation = {
  __typename?: 'Mutation';
  registerUser: { __typename?: 'User'; id: string };
};

export type GetPaymentSetupSessionQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPaymentSetupSessionQuery = {
  __typename?: 'Query';
  getPaymentSetupSession: { __typename?: 'paymentSetupSession'; id: string };
};

export type UserProfileQueryVariables = Exact<{ [key: string]: never }>;

export type UserProfileQuery = {
  __typename?: 'Query';
  currentUser?: Maybe<{
    __typename?: 'User';
    id: string;
    fullName: string;
    picture: string;
    email_verified: boolean;
    email: string;
    birthdate: any;
    firstName: string;
    currentTenant?: Maybe<{
      __typename?: 'UsersOfTenants';
      status: MembershipStatus;
      stripeData?: Maybe<{
        __typename?: 'StripeUserData';
        paymentMethodId?: Maybe<string>;
      }>;
    }>;
    organizedEvents: Array<{
      __typename?: 'TumiEvent';
      id: string;
      title: string;
      icon: string;
      start: any;
    }>;
  }>;
};

export type CreateOrganizerMutationVariables = Exact<{
  input: NewOrganizerInput;
}>;

export type CreateOrganizerMutation = {
  __typename?: 'Mutation';
  createEventOrganizer?: Maybe<{ __typename?: 'EventOrganizer'; id: string }>;
};

export type GetOrganizersQueryVariables = Exact<{ [key: string]: never }>;

export type GetOrganizersQuery = {
  __typename?: 'Query';
  organizers: Array<{
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
    text: string;
  }>;
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetUsersQuery = {
  __typename?: 'Query';
  users: Array<{
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    currentTenant?: Maybe<{
      __typename?: 'UsersOfTenants';
      role: Role;
      status: MembershipStatus;
    }>;
  }>;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  role: Role;
  status: MembershipStatus;
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUserRole: {
    __typename?: 'User';
    id: string;
    currentTenant?: Maybe<{ __typename?: 'UsersOfTenants'; role: Role }>;
  };
  updateUserStatus: {
    __typename?: 'User';
    id: string;
    currentTenant?: Maybe<{
      __typename?: 'UsersOfTenants';
      status: MembershipStatus;
    }>;
  };
};

export const GetCurrentUserDocument = gql`
  query getCurrentUser {
    currentUser {
      id
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
  document = GetCurrentUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UserRolesDocument = gql`
  query userRoles {
    currentUser {
      id
      fullName
      currentTenant {
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
  document = UserRolesDocument;

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
  providedIn: 'root',
})
export class CreateEventTemplateGQL extends Apollo.Mutation<
  CreateEventTemplateMutation,
  CreateEventTemplateMutationVariables
> {
  document = CreateEventTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateEventFromTemplateDocument = gql`
  mutation createEventFromTemplate(
    $templateId: ID!
    $eventData: CreateEventFromTemplateInput!
  ) {
    createEventFromTemplate(
      templateId: $templateId
      createEventFromTemplateInput: $eventData
    ) {
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
  document = CreateEventFromTemplateDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateEventTemplateDocument = gql`
  mutation updateEventTemplate(
    $templateId: ID!
    $update: UpdateTemplateInput!
  ) {
    updateTemplate(id: $templateId, data: $update) {
      id
      title
      icon
      duration
      description
      organizerText
      participantMail
      participantText
      comment
      location
      locationId
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
  document = UpdateEventTemplateDocument;

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
  providedIn: 'root',
})
export class DeleteEventTemplateGQL extends Apollo.Mutation<
  DeleteEventTemplateMutation,
  DeleteEventTemplateMutationVariables
> {
  document = DeleteEventTemplateDocument;

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
  providedIn: 'root',
})
export class DeleteTemplateGQL extends Apollo.Mutation<
  DeleteTemplateMutation,
  DeleteTemplateMutationVariables
> {
  document = DeleteTemplateDocument;

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
  document = GetEventTemplatesDocument;

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
      participantMail
      participantText
      comment
      location
      locationId
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
  document = GetEventTemplateDocument;

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
  providedIn: 'root',
})
export class GetOrganizerOptionsGQL extends Apollo.Query<
  GetOrganizerOptionsQuery,
  GetOrganizerOptionsQueryVariables
> {
  document = GetOrganizerOptionsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LoadEventDocument = gql`
  query loadEvent($id: ID!) {
    event(eventId: $id) {
      id
      title
      icon
      start
      end
      publicationState
      description
      organizerText
      registrationMode
      registrationLink
      price
      organizer {
        link
        text
      }
      organizerSignup
      participantSignup
      organizerRegistrationPossible
      couldBeOrganizer
      couldBeParticipant
      organizers {
        fullName
      }
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
  document = LoadEventDocument;

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
      description
      organizerText
      registrationMode
      price
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
      organizers {
        fullName
        picture
        id
      }
    }
    organizers {
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
  document = LoadEventForEditDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveUserFromEventDocument = gql`
  mutation removeUserFromEvent($eventId: ID!, $userId: ID!) {
    removeUserFromEvent(eventId: $eventId, userId: $userId) {
      id
      organizers {
        id
        fullName
        picture
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveUserFromEventGQL extends Apollo.Mutation<
  RemoveUserFromEventMutation,
  RemoveUserFromEventMutationVariables
> {
  document = RemoveUserFromEventDocument;

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
  document = AddOrganizerToEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateEventDocument = gql`
  mutation updateEvent($id: ID!, $data: UpdateEventInput!) {
    updateEventGeneralInfo(id: $id, data: $data) {
      title
      icon
      start
      end
      description
      organizerText
      registrationMode
      registrationLink
      price
      eventOrganizerId
      organizerSignup
      participantSignup
      participantLimit
      organizerLimit
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateEventGQL extends Apollo.Mutation<
  UpdateEventMutation,
  UpdateEventMutationVariables
> {
  document = UpdateEventDocument;

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
  providedIn: 'root',
})
export class LoadUsersByStatusGQL extends Apollo.Query<
  LoadUsersByStatusQuery,
  LoadUsersByStatusQueryVariables
> {
  document = LoadUsersByStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RegisterForEventDocument = gql`
  mutation registerForEvent($eventId: ID!, $type: RegistrationType) {
    registerForEvent(eventId: $eventId, registrationType: $type) {
      id
      organizerRegistrationPossible
      participantRegistrationPossible
      organizersRegistered
      participantsRegistered
      couldBeOrganizer
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
  document = RegisterForEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const EventListDocument = gql`
  query eventList {
    events {
      id
      title
      icon
      start
      participantLimit
      participantsRegistered
      organizerLimit
      organizersRegistered
      couldBeOrganizer
      couldBeParticipant
      publicationState
      registrationMode
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
  document = EventListDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RegisterUserDocument = gql`
  mutation RegisterUser($userInput: CreateUserInput) {
    registerUser(userInput: $userInput) {
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
  document = RegisterUserDocument;

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
  providedIn: 'root',
})
export class GetPaymentSetupSessionGQL extends Apollo.Query<
  GetPaymentSetupSessionQuery,
  GetPaymentSetupSessionQueryVariables
> {
  document = GetPaymentSetupSessionDocument;

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
      birthdate
      firstName
      currentTenant {
        status
        stripeData {
          paymentMethodId
        }
      }
      organizedEvents {
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
export class UserProfileGQL extends Apollo.Query<
  UserProfileQuery,
  UserProfileQueryVariables
> {
  document = UserProfileDocument;

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
  document = CreateOrganizerDocument;

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
  providedIn: 'root',
})
export class GetOrganizersGQL extends Apollo.Query<
  GetOrganizersQuery,
  GetOrganizersQueryVariables
> {
  document = GetOrganizersDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetUsersDocument = gql`
  query getUsers {
    users {
      id
      firstName
      lastName
      currentTenant {
        role
        status
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetUsersGQL extends Apollo.Query<
  GetUsersQuery,
  GetUsersQueryVariables
> {
  document = GetUsersDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateUserDocument = gql`
  mutation updateUser($id: ID!, $role: Role!, $status: MembershipStatus!) {
    updateUserRole(userId: $id, role: $role) {
      id
      currentTenant {
        role
      }
    }
    updateUserStatus(userId: $id, status: $status) {
      id
      currentTenant {
        status
      }
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
  document = UpdateUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
