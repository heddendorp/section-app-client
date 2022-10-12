import { builder } from '../../builder';
import {
  EnrollmentStatus,
  PurchaseStatus,
  RegistrationStatus,
  RegistrationType,
} from '../../generated/prisma';
import { DateTime } from 'luxon';
import prisma from '../../client';
import ScopeService from '../../helpers/scopeService';

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  grantScopes: async (user, context) =>
    ScopeService.getScopesForUser(user.id, context),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    authId: t.exposeString('authId'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    birthdate: t.expose('birthdate', {
      type: 'DateTime',
      nullable: true,
      authScopes: {
        $granted: 'ownProfile',
        admin: true,
      },
      unauthorizedResolver: () => null,
    }),
    picture: t.string({
      resolve: (user) => {
        if (user.picture.includes('/storage/') && process.env.DEV) {
          return user.picture.replace(
            '/storage/',
            'https://storetumi.blob.core.windows.net/'
          );
        }
        return user.picture;
      },
    }),
    phone: t.exposeString('phone', {
      nullable: true,
      authScopes: {
        $granted: 'memberProfile',
        member: true,
      },
      unauthorizedResolver: () => null,
    }),
    university: t.exposeString('university', { nullable: true }),
    iban: t.exposeString('iban', {
      nullable: true,
      authScopes: {
        $granted: 'ownProfile',
        admin: true,
      },
      unauthorizedResolver: () => null,
    }),
    paypal: t.exposeString('paypal', {
      nullable: true,
      authScopes: {
        $granted: 'ownProfile',
        admin: true,
      },
      unauthorizedResolver: () => null,
    }),
    emailVerified: t.exposeBoolean('email_verified'),
    email: t.exposeString('email', {
      authScopes: {
        $granted: 'ownProfile',
        member: true,
      },
      unauthorizedResolver: () => '',
    }),
    communicationEmail: t.exposeString('communicationEmail', {
      nullable: true,
      authScopes: {
        $granted: 'ownProfile',
        member: true,
      },
      unauthorizedResolver: () => '',
    }),
    calendarToken: t.exposeString('calendarToken'),
    esnCardOverride: t.exposeBoolean('esnCardOverride'),
    transactions: t.relation('transactions'),
    createdTransactions: t.relation('createdTransactions'),
    enrolmentStatus: t.expose('enrolmentStatus', { type: EnrollmentStatus }),
    bio: t.exposeString('bio', { nullable: true }),
    country: t.exposeString('country', { nullable: true }),
    homeUniversity: t.exposeString('homeUniversity', { nullable: true }),
    instagram: t.exposeString('instagram', { nullable: true }),
    position: t.exposeString('position', { nullable: true }),
    studyProgram: t.exposeString('studyProgram', { nullable: true }),
    purchases: t.relation('purchases', {
      args: {
        skipCancelled: t.arg.boolean({ defaultValue: false }),
      },
      query: (args, context) =>
        args.skipCancelled
          ? { where: { status: { not: PurchaseStatus.CANCELLED } } }
          : {},
    }),
    profileComplete: t.boolean({
      resolve: (source) =>
        !!(
          source.firstName &&
          source.lastName &&
          source.birthdate &&
          source.picture &&
          source.university &&
          source.enrolmentStatus !== EnrollmentStatus.NONE
        ),
    }),
    outstandingRating: t.boolean({
      resolve: async (source, args, context) => {
        const lastWeek = DateTime.local().minus({ days: 7 });
        const registrations = await prisma.user
          .findUnique({
            where: { id: source.id },
          })
          .eventRegistrations({
            where: {
              event: {
                excludeFromRatings: false,
                end: {
                  gt: lastWeek.toJSDate(),
                  lt: new Date(),
                },
              },
              status: { not: RegistrationStatus.CANCELLED },
              rating: null,
            },
          });
        return (registrations?.length ?? 0) > 0;
      },
    }),
    hasEsnCard: t.boolean({
      resolve: async (source, args, context) => {
        if (source.esnCardOverride) {
          return true;
        }

        const cardBought = await prisma.eventRegistration.count({
          where: {
            user: { id: source.id },
            event: { title: { contains: 'ESNcard' } },
            type: RegistrationType.PARTICIPANT,
          },
        });
        return !!cardBought;
      },
    }),
    currentTenant: t.prismaField({
      type: 'UsersOfTenants',
      nullable: true,
      args: { userId: t.arg.id() },
      resolve: async (query, source, args, context) => {
        if (!args.userId) {
          args.userId = source.id;
        }
        return prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: args.userId,
              tenantId: context.tenant.id,
            },
          },
          rejectOnNotFound: false,
        });
      },
    }),
    organizedEvents: t.prismaField({
      type: ['TumiEvent'],
      args: {
        hideCancelled: t.arg.boolean({ defaultValue: false }),
      },
      resolve: async (query, source, args, context) => {
        return prisma.tumiEvent.findMany({
          ...query,
          where: {
            registrations: {
              some: {
                user: { id: source.id },
                type: RegistrationType.ORGANIZER,
                ...(args.hideCancelled
                  ? { status: { not: RegistrationStatus.CANCELLED } }
                  : {}),
              },
            },
          },
          orderBy: { start: 'asc' },
        });
      },
    }),
    participatedEvents: t.prismaField({
      type: ['TumiEvent'],
      args: {
        hideCancelled: t.arg.boolean({ defaultValue: false }),
      },
      resolve: async (query, source, args, context) => {
        return prisma.tumiEvent.findMany({
          ...query,
          where: {
            registrations: {
              some: {
                user: { id: source.id },
                type: RegistrationType.PARTICIPANT,
                ...(args.hideCancelled
                  ? { status: { not: RegistrationStatus.CANCELLED } }
                  : {}),
              },
            },
          },
          orderBy: { start: 'asc' },
        });
      },
    }),
    organizedEventsCount: t.int({
      resolve: async (user, args, context) =>
        prisma.tumiEvent.count({
          where: {
            excludeFromStatistics: false,
            registrations: {
              some: {
                user: { id: user.id },
                type: RegistrationType.ORGANIZER,
                status: RegistrationStatus.SUCCESSFUL,
              },
            },
          },
        }),
    }),
    createdEvents: t.prismaField({
      type: ['TumiEvent'],
      resolve: async (query, user, args, context) => {
        return prisma.tumiEvent.findMany({
          ...query,
          where: {
            createdBy: { id: user.id },
          },
          orderBy: { start: 'asc' },
        });
      },
    }),
    createdEventsCount: t.int({
      resolve: async (user, args, context) =>
        prisma.tumiEvent.count({
          where: {
            excludeFromStatistics: false,
            createdBy: { id: user.id },
          },
        }),
    }),
    eventRegistrations: t.relation('eventRegistrations', {
      query: (args, context) => ({
        orderBy: [{ event: { start: 'desc' } }],
      }),
    }),
    hasESNCard: t.boolean({
      resolve: async (source, args, context) => {
        if (source.esnCardOverride) {
          return true;
        }
        const cardBought = await prisma.eventRegistration.count({
          where: {
            user: { id: source.id },
            event: { title: { contains: 'ESNcard' } },
            type: RegistrationType.PARTICIPANT,
            status: { not: RegistrationStatus.CANCELLED },
          },
        });
        return !!cardBought;
      },
    }),
    fullName: t.string({
      resolve: (source) => `${source.firstName} ${source.lastName}`,
    }),
  }),
});

export const createUserInputType = builder.inputType('CreateUserInput', {
  fields: (t) => ({
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    university: t.string({ required: true }),
    birthdate: t.field({ type: 'DateTime', required: true }),
    enrolmentStatus: t.field({ type: EnrollmentStatus, required: true }),
    phone: t.string(),
  }),
});

export const updateUserInputType = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    firstName: t.string(),
    lastName: t.string(),
    university: t.string(),
    communicationEmail: t.string(),
    birthdate: t.field({ type: 'DateTime' }),
    phone: t.string(),
    enrolmentStatus: t.field({ type: EnrollmentStatus }),
    bio: t.string(),
    country: t.string(),
    homeUniversity: t.string(),
    instagram: t.string(),
    studyProgram: t.string(),
  }),
});
