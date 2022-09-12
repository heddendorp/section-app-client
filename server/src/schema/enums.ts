import { builder } from '../builder';
import {
  EnrollmentStatus,
  LogSeverity,
  MembershipStatus,
  PublicationState,
  PurchaseStatus,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  Role,
  SubmissionItemType,
  SubmissionTime,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../generated/prisma';

builder.enumType(EnrollmentStatus, { name: 'EnrolmentStatus' });
builder.enumType(LogSeverity, { name: 'LogSeverity' });
builder.enumType(MembershipStatus, { name: 'MembershipStatus' });
builder.enumType(PublicationState, { name: 'PublicationState' });
builder.enumType(PurchaseStatus, { name: 'PurchaseStatus' });
builder.enumType(RegistrationStatus, { name: 'RegistrationStatus' });
builder.enumType(RegistrationMode, { name: 'RegistrationMode' });
builder.enumType(RegistrationType, { name: 'RegistrationType' });
builder.enumType(Role, { name: 'Role' });
builder.enumType(SubmissionItemType, { name: 'SubmissionItemType' });
builder.enumType(SubmissionTime, { name: 'SubmissionTime' });
builder.enumType(TransactionType, { name: 'TransactionType' });
builder.enumType(TransactionDirection, { name: 'TransactionDirection' });
builder.enumType(TransactionStatus, { name: 'TransactionStatus' });
