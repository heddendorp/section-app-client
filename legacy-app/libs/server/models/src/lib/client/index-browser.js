
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 3.0.2
 * Query Engine version: 2452cc6313d52b8b9a96999ac0e974d0aedf88db
 */
Prisma.prismaVersion = {
  client: "3.0.2",
  engine: "2452cc6313d52b8b9a96999ac0e974d0aedf88db"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = 'DbNull'
Prisma.JsonNull = 'JsonNull'
Prisma.AnyNull = 'AnyNull'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.TenantScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  name: 'name',
  shortName: 'shortName'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  authId: 'authId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  birthdate: 'birthdate'
});

exports.Prisma.UsersOfTenantsScalarFieldEnum = makeEnum({
  createdAt: 'createdAt',
  userId: 'userId',
  tenantId: 'tenantId',
  role: 'role',
  status: 'status'
});

exports.Prisma.EventOrganizerScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  tenantId: 'tenantId',
  name: 'name',
  text: 'text',
  link: 'link'
});

exports.Prisma.EventTemplateScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  title: 'title',
  icon: 'icon',
  description: 'description',
  comment: 'comment',
  location: 'location',
  locationId: 'locationId',
  duration: 'duration',
  participantText: 'participantText',
  participantMail: 'participantMail',
  organizerText: 'organizerText',
  finances: 'finances',
  tenantId: 'tenantId'
});

exports.Prisma.TumiEventScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  title: 'title',
  icon: 'icon',
  start: 'start',
  end: 'end',
  description: 'description',
  location: 'location',
  locationId: 'locationId',
  participantText: 'participantText',
  participantMail: 'participantMail',
  organizerText: 'organizerText',
  participantLimit: 'participantLimit',
  organizerLimit: 'organizerLimit',
  publicationState: 'publicationState',
  participantSignup: 'participantSignup',
  organizerSignup: 'organizerSignup',
  eventOrganizerId: 'eventOrganizerId',
  creatorId: 'creatorId',
  eventTemplateId: 'eventTemplateId'
});

exports.Prisma.CostItemScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  eventId: 'eventId',
  name: 'name',
  ammount: 'ammount'
});

exports.Prisma.ReceiptScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  userId: 'userId',
  costItemId: 'costItemId',
  covered: 'covered',
  amount: 'amount',
  date: 'date',
  amountCovered: 'amountCovered'
});

exports.Prisma.PhotoShareScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  eventId: 'eventId'
});

exports.Prisma.EventRegistrationScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  type: 'type',
  userId: 'userId',
  eventId: 'eventId'
});

exports.Prisma.EventSubmissionItemScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  eventId: 'eventId',
  required: 'required',
  submissionTime: 'submissionTime'
});

exports.Prisma.EventSubmissionScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  userId: 'userId',
  submissionItemId: 'submissionItemId'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.JsonNullValueInput = makeEnum({
  JsonNull: 'JsonNull'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: 'DbNull',
  JsonNull: 'JsonNull',
  AnyNull: 'AnyNull'
});
exports.Role = makeEnum({
  USER: 'USER',
  ADMIN: 'ADMIN'
});

exports.MembershipStatus = makeEnum({
  NONE: 'NONE',
  TRIAL: 'TRIAL',
  FULL: 'FULL',
  SPONSOR: 'SPONSOR',
  ALUMNI: 'ALUMNI'
});

exports.PublicationState = makeEnum({
  DRAFT: 'DRAFT',
  APPROVAL: 'APPROVAL',
  PUBLIC: 'PUBLIC'
});

exports.RegistrationType = makeEnum({
  ORGANIZER: 'ORGANIZER',
  PARTICIPANT: 'PARTICIPANT'
});

exports.SubmissionTime = makeEnum({
  REGISTRATION: 'REGISTRATION',
  BEFORE: 'BEFORE',
  DURING: 'DURING',
  AFTER: 'AFTER'
});

exports.Prisma.ModelName = makeEnum({
  Tenant: 'Tenant',
  User: 'User',
  UsersOfTenants: 'UsersOfTenants',
  EventOrganizer: 'EventOrganizer',
  EventTemplate: 'EventTemplate',
  TumiEvent: 'TumiEvent',
  CostItem: 'CostItem',
  Receipt: 'Receipt',
  PhotoShare: 'PhotoShare',
  EventRegistration: 'EventRegistration',
  EventSubmissionItem: 'EventSubmissionItem',
  EventSubmission: 'EventSubmission'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
