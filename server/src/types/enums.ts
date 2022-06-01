import { enumType } from 'nexus';
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
  TransactionType,
} from '../generated/nexus-prisma';

export const roleEnum = enumType(Role);
export const enrolmentStatusEnum = enumType(EnrollmentStatus);
export const membershipStatusEnum = enumType(MembershipStatus);
export const publicationStateEnum = enumType(PublicationState);
export const submissionItemTypeEnum = enumType(SubmissionItemType);
export const submissionTimeEnum = enumType(SubmissionTime);
export const registrationTypeEnum = enumType(RegistrationType);
export const registrationModeEnum = enumType(RegistrationMode);
export const logSeverityEnum = enumType(LogSeverity);
export const registrationStatusEnum = enumType(RegistrationStatus);
export const purchaseStatusEnum = enumType(PurchaseStatus);
export const transactionTypeEnum = enumType(TransactionType);
