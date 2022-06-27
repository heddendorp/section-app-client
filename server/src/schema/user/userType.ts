import { builder } from '../../builder';
import {
  EnrollmentStatus,
  PurchaseStatus,
  RegistrationStatus,
  RegistrationType,
} from '../../generated/prisma';
import { DateTime } from 'luxon';
import prisma from '../../client';

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    authId: t.exposeString('authId'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    birthdate: t.expose('birthdate', { type: 'DateTime', nullable: true }),
    picture: t.exposeString('picture'),
    phone: t.exposeString('phone', { nullable: true }),
    university: t.exposeString('university', { nullable: true }),
    iban: t.exposeString('iban', { nullable: true }),
    paypal: t.exposeString('paypal', { nullable: true }),
    emailVerified: t.exposeBoolean('email_verified'),
    email: t.exposeString('email'),
    calendarToken: t.exposeString('calendarToken'),
    esnCardOverride: t.exposeBoolean('esnCardOverride'),
    transactions: t.relation('transactions'),
    createdTransactions: t.relation('createdTransactions'),
    enrolmentStatus: t.expose('enrolmentStatus', { type: EnrollmentStatus }),
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
        return registrations.length > 0;
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
    eventRegistrations: t.relation('eventRegistrations'),
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
    birthdate: t.field({ type: 'DateTime' }),
    phone: t.string(),
    enrolmentStatus: t.field({ type: EnrollmentStatus }),
  }),
});
