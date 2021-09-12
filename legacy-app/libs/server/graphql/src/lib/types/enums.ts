import { enumType } from 'nexus';
import {
  MembershipStatus,
  PublicationState,
  RegistrationType,
  Role,
  SubmissionItemType,
  SubmissionTime,
} from 'nexus-prisma';

export const roleEnum = enumType(Role);
export const membershipStatusEnum = enumType(MembershipStatus);
export const publicationStateEnum = enumType(PublicationState);
export const submissionItemTypeEnum = enumType(SubmissionItemType);
export const submissionTimeEnum = enumType(SubmissionTime);
export const registrationTypeEnum = enumType(RegistrationType);
