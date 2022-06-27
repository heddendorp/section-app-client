import { builder } from '../../builder';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  SubmissionTime,
} from '../../generated/prisma';
import { DateTime } from 'luxon';
import prisma from '../../client';
import { parentPort } from 'worker_threads';

export const eventType = builder.prismaObject('TumiEvent', {
  findUnique: (event) => ({ id: event.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    creatorId: t.exposeID('creatorId'),
    createdBy: t.relation('createdBy'),
    eventOrganizerId: t.exposeID('eventOrganizerId'),
    organizer: t.relation('organizer'),
    title: t.exposeString('title'),
    icon: t.exposeString('icon'),
    start: t.expose('start', { type: 'DateTime' }),
    end: t.expose('end', { type: 'DateTime' }),
    registrationStart: t.expose('registrationStart', { type: 'DateTime' }),
    description: t.exposeString('description'),
    disableDeregistration: t.exposeBoolean('disableDeregistration'),
    excludeFromStatistics: t.exposeBoolean('excludeFromStatistics'),
    excludeFromRatings: t.exposeBoolean('excludeFromRatings'),
    coordinates: t.expose('coordinates', { type: 'JSON', nullable: true }),
    prices: t.expose('prices', { type: 'JSON', nullable: true }),
    location: t.exposeString('location'),
    googlePlaceId: t.exposeString('googlePlaceId', { nullable: true }),
    googlePlaceUrl: t.exposeString('googlePlaceUrl', { nullable: true }),
    registrationLink: t.exposeString('registrationLink', { nullable: true }),
    registrationMode: t.expose('registrationMode', { type: RegistrationMode }),
    participantText: t.exposeString('participantText'),
    organizerText: t.exposeString('organizerText'),
    organizerSignup: t.exposeStringList('organizerSignup'),
    participantSignup: t.exposeStringList('participantSignup'),
    participantLimit: t.exposeInt('participantLimit'),
    organizerLimit: t.exposeInt('organizerLimit'),
    publicationState: t.expose('publicationState', { type: PublicationState }),
    participantRegistrationCount: t.exposeInt('participantRegistrationCount'),
    eventRegistrationCodes: t.relation('eventRegistrationCodes'),
    insuranceDescription: t.exposeString('insuranceDescription'),
    shouldBeReportedToInsurance: t.exposeBoolean('shouldBeReportedToInsurance'),
    countedParticipantRegistrations: t.int({
      resolve: async (event, args, context) =>
        prisma.eventRegistration.count({
          where: {
            event: { id: event.id },
            status: { not: RegistrationStatus.CANCELLED },
          },
        }),
    }),
    submissionItems: t.relation('submissionItems', {
      args: {
        submissionTime: t.arg({ type: SubmissionTime }),
      },
      query: (args, context) =>
        args.submissionTime
          ? { where: { submissionTime: args.submissionTime } }
          : {},
    }),
    costItems: t.relation('costItems', {
      args: {
        hideOnInvoice: t.arg.boolean({ defaultValue: false }),
      },
      query: (args, context) =>
        args.hideOnInvoice ? { where: { onInvoice: false } } : {},
    }),
    photoShares: t.relation('photoShares'),
    eventTemplate: t.relation('eventTemplate'),
    eventTemplateId: t.exposeID('eventTemplateId'),
    freeParticipantSpots: t.string({
      resolve: async (event, args, context) => {
        const quota =
          event.participantRegistrationCount / event.participantLimit;
        if (quota < 0.5) {
          return 'Many free spots';
        } else if (quota < 0.8) {
          return 'Some spots left';
        } else if (quota < 1) {
          return 'Few spots left';
        } else if (
          event.participantLimit - event.participantRegistrationCount ===
          1
        ) {
          return 'One spot left';
        } else {
          return 'Event is full';
        }
      },
    }),
    needsRating: t.boolean({
      resolve: async (source, args, context) => {
        const lastWeek = DateTime.local().minus({ days: 7 });
        const registrations = await prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              event: {
                excludeFromRatings: false,
                end: {
                  gt: lastWeek.toJSDate(),
                  lt: new Date(),
                },
              },
              user: { id: context.user?.id },
              status: { not: RegistrationStatus.CANCELLED },
              rating: null,
            },
          });
        return registrations.length > 0;
      },
    }),
    participantRatings: t.float({
      nullable: true,
      resolve: async (source, args, context) => {
        return prisma.eventRegistration
          .aggregate({
            where: {
              event: { id: source.id },
              status: { not: RegistrationStatus.CANCELLED },
              type: RegistrationType.PARTICIPANT,
              rating: {
                not: null,
              },
            },
            _avg: {
              rating: true,
            },
          })
          .then(({ _avg: { rating } }) => rating);
      },
    }),
    organizerRatings: t.float({
      nullable: true,
      resolve: async (source, args, context) => {
        return prisma.eventRegistration
          .aggregate({
            where: {
              event: { id: source.id },
              status: { not: RegistrationStatus.CANCELLED },
              type: RegistrationType.ORGANIZER,
              rating: {
                not: null,
              },
            },
            _avg: {
              rating: true,
            },
          })
          .then(({ _avg: { rating } }) => rating);
      },
    }),
    activeRegistration: t.prismaField({
      type: 'EventRegistration',
      nullable: true,
      resolve: async (query, parent, args, context, info) => {
        return prisma.eventRegistration.findFirst({
          ...query,
          where: {
            user: { id: context.user?.id },
            event: { id: parent.id },
            status: { not: RegistrationStatus.CANCELLED },
          },
          rejectOnNotFound: false,
        });
      },
    }),
    ownRegistrations: t.relation('registrations', {
      args: {
        includeCancelled: t.arg.boolean({ defaultValue: false }),
      },
      query: (args, context) => ({
        where: {
          user: { id: context.user?.id },
          ...(args.includeCancelled
            ? {}
            : { status: { not: RegistrationStatus.CANCELLED } }),
        },
      }),
    }),
    participantRegistrations: t.relation('registrations', {
      args: {
        includeCancelled: t.arg.boolean({ defaultValue: false }),
      },
      query: (args, context) => ({
        where: {
          type: RegistrationType.PARTICIPANT,
          ...(args.includeCancelled
            ? {}
            : { status: { not: RegistrationStatus.CANCELLED } }),
        },
        orderBy: [
          { status: 'asc' },
          { checkInTime: 'desc' },
          { user: { lastName: 'asc' } },
        ],
      }),
    }),
    organizerRegistrations: t.relation('registrations', {
      query: (args, context) => ({
        where: {
          type: RegistrationType.ORGANIZER,
          status: { not: RegistrationStatus.CANCELLED },
        },
      }),
    }),
    amountCollected: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.stripePayment
          .aggregate({
            where: {
              transaction: {
                eventRegistration: {
                  event: { id: source.id },
                },
              },
            },
            _sum: { amount: true },
          })
          .then(
            (aggregations) => (aggregations._sum.amount?.toNumber() ?? 0) / 100
          )
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
    netAmountCollected: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.stripePayment
          .aggregate({
            where: {
              transaction: {
                eventRegistration: {
                  event: { id: source.id },
                },
              },
            },
            _sum: { netAmount: true, refundedAmount: true },
          })
          .then(
            (aggregations) =>
              ((aggregations._sum.netAmount?.toNumber() ?? 0) -
                (aggregations._sum.refundedAmount?.toNumber() ?? 0)) /
              100
          )
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
    feesPaid: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.stripePayment
          .aggregate({
            where: {
              transaction: {
                eventRegistration: {
                  event: { id: source.id },
                },
              },
            },
            _sum: { feeAmount: true },
          })
          .then(
            (aggregations) =>
              (aggregations._sum.feeAmount?.toNumber() ?? 0) / 100
          )
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
    refundFeesPaid: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.stripePayment
          .aggregate({
            where: {
              transaction: {
                eventRegistration: {
                  event: { id: source.id },
                  status: RegistrationStatus.CANCELLED,
                },
              },
            },
            _sum: { feeAmount: true },
          })
          .then(
            (aggregations) =>
              (aggregations._sum.feeAmount?.toNumber() ?? 0) / 100
          )
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
    plannedSpend: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.costItem
          .aggregate({
            where: {
              event: { id: source.id },
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount)
          .then((amount) => new Prisma.Decimal(amount ?? 0));
      },
    }),
    submittedSpend: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.receipt
          .aggregate({
            where: {
              costItem: { event: { id: source.id } },
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount)
          .then((amount) => new Prisma.Decimal(amount ?? 0));
      },
    }),
    userIsRegistered: t.boolean({
      authScopes: { public: true },
      unauthorizedResolver: () => false,
      resolve: async (parent, args, context) => {
        return prisma.tumiEvent
          .findUnique({ where: { id: parent.id } })
          .registrations({
            where: {
              user: { id: context.user?.id },
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => registrations.length > 0);
      },
    }),
    userIsCreator: t.boolean({
      authScopes: { public: true },
      unauthorizedResolver: () => false,
      resolve: async (parent, args, context) => {
        return parent.creatorId === context.user?.id;
      },
    }),
    userIsOrganizer: t.boolean({
      authScopes: { public: true },
      unauthorizedResolver: () => false,
      resolve: async (parent, args, context) => {
        return prisma.tumiEvent
          .findUnique({ where: { id: parent.id } })
          .registrations({
            where: {
              user: { id: context.user?.id },
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((organizers) => organizers.length > 0);
      },
    }),
    organizers: t.prismaField({
      type: ['User'],
      resolve: async (query, parent, args, context) => {
        return prisma.user.findMany({
          ...query,
          where: {
            eventRegistrations: {
              some: {
                event: { id: parent.id },
                type: RegistrationType.ORGANIZER,
                status: { not: RegistrationStatus.CANCELLED },
              },
            },
          },
        });
      },
    }),
    couldBeOrganizer: t.boolean({
      authScopes: { public: true },
      unauthorizedResolver: () => false,
      resolve: async (parent, args, context) => {
        const { status } = context.userOfTenant ?? {};
        if (!parent.organizerSignup.includes(status ?? MembershipStatus.NONE)) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing status ' +
                status
            );
          }
          return false;
        }
        return true;
      },
    }),
    couldBeParticipant: t.boolean({
      authScopes: { public: true },
      unauthorizedResolver: () => false,
      resolve: async (parent, args, context) => {
        const { status } = context.userOfTenant ?? {};
        if (
          !parent.participantSignup.includes(status ?? MembershipStatus.NONE)
        ) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing status ' +
                status
            );
          }
          return false;
        }
        return true;
      },
    }),
    participantsAttended: t.int({
      resolve: async (parent, args, context) => {
        return prisma.eventRegistration.count({
          where: {
            event: { id: parent.id },
            status: { not: RegistrationStatus.CANCELLED },
            type: RegistrationType.PARTICIPANT,
            checkInTime: { not: null },
          },
        });
      },
    }),
    participantRegistrationPossible: t.field({
      type: 'JSON',
      resolve: async (parent, args, context) => {
        if (!context.user) {
          if (process.env.DEV) {
            console.info(`Can't register participant because user is missing`);
          }
          return {
            option: false,
            reason: 'You have to log in to register!',
          } as any;
        }
        const { status } = context.userOfTenant ?? {};
        if (
          !parent.participantSignup.includes(status ?? MembershipStatus.NONE)
        ) {
          if (process.env.DEV) {
            console.info(
              `Can't register participant because status is not allowed ${status}`
            );
          }
          return {
            option: false,
            reason: 'You do not have the required status to sign up!',
          };
        }
        const previousRegistration = await prisma.eventRegistration.findFirst({
          where: {
            userId: context.user.id,
            eventId: parent.id,
            status: { not: RegistrationStatus.CANCELLED },
          },
          rejectOnNotFound: false,
        });
        if (previousRegistration) {
          if (process.env.DEV) {
            console.info(
              `Can't register participant because there is a registration already`
            );
          }
          return {
            option: false,
            reason: 'You are already registered for this event!',
          };
        }
        if (parent.participantRegistrationCount >= parent.participantLimit) {
          if (process.env.DEV) {
            console.info(
              `Can't register because to many people are on event ${parent.participantRegistrationCount} >= ${parent.participantLimit}`
            );
          }
          return {
            option: false,
            reason: `This event is already at capacity!\nYou can check back at a later time in case spots become available.`,
          };
        }
        return { option: true };
      },
    }),
    organizersRegistered: t.int({
      resolve: async (parent, args, context) => {
        return prisma.eventRegistration.count({
          where: {
            event: { id: parent.id },
            status: { not: RegistrationStatus.CANCELLED },
            type: RegistrationType.ORGANIZER,
          },
        });
      },
    }),
    organizerRegistrationPossible: t.boolean({
      resolve: async (parent, args, context) => {
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.userOfTenant ?? {};
        if (!parent.organizerSignup.includes(status ?? MembershipStatus.NONE)) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing status ' +
                status
            );
          }
          return false;
        }
        const previousRegistration = await prisma.eventRegistration.findFirst({
          where: {
            userId: context.user.id,
            eventId: parent.id,
            status: { not: RegistrationStatus.CANCELLED },
          },
          rejectOnNotFound: false,
        });
        if (previousRegistration) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of already registered'
            );
            console.info(previousRegistration);
          }
          return false;
        }
        const currentRegistrationNum = await prisma.eventRegistration.count({
          where: {
            type: RegistrationType.ORGANIZER,
            status: { not: RegistrationStatus.CANCELLED },
            event: { id: parent.id },
          },
        });
        return currentRegistrationNum < parent.organizerLimit;
      },
    }),
  }),
});

export const updateEventLocationInputType = builder.inputType(
  'UpdateEventLocationInput',
  {
    fields: (t) => ({
      location: t.string({ required: true }),
      coordinates: t.field({ type: 'JSON' }),
      googlePlaceId: t.string(),
      googlePlaceUrl: t.string(),
    }),
  }
);

export const createEventFromTemplateInput = builder.inputType(
  'CreateEventFromTemplateInput',
  {
    fields: (t) => ({
      start: t.field({ type: 'DateTime', required: true }),
      end: t.field({ type: 'DateTime', required: true }),
      participantLimit: t.int({ required: true }),
      organizerLimit: t.int({ required: true }),
      registrationLink: t.string(),
      registrationMode: t.field({ type: RegistrationMode, required: true }),
      eventOrganizerId: t.id({ required: true }),
      price: t.field({ type: 'Decimal' }),
      excludeFromStatistics: t.boolean({ required: true, defaultValue: false }),
      excludeFromRatings: t.boolean({ required: true, defaultValue: false }),
    }),
  }
);

export const updateGeneralEventInputType = builder.inputType(
  'UpdateGeneralEventInput',
  {
    fields: (t) => ({
      description: t.string(),
      organizerText: t.string(),
      participantText: t.string(),
    }),
  }
);

export const updateCoreEventInputType = builder.inputType(
  'UpdateCoreEventInput',
  {
    fields: (t) => ({
      disableDeregistration: t.boolean(),
      excludeFromStatistics: t.boolean(),
      excludeFromRatings: t.boolean(),
      end: t.field({ type: 'DateTime' }),
      icon: t.string(),
      insuranceDescription: t.string(),
      organizerLimit: t.int(),
      organizerSignup: t.field({ type: [MembershipStatus] }),
      participantLimit: t.int(),
      participantSignup: t.field({ type: [MembershipStatus] }),
      prices: t.field({ type: 'JSON' }),
      registrationLink: t.string(),
      registrationMode: t.field({ type: RegistrationMode }),
      registrationStart: t.field({ type: 'DateTime' }),
      shouldBeReportedToInsurance: t.boolean(),
      eventOrganizerId: t.id({ required: true }),
      start: t.field({ type: 'DateTime' }),
      title: t.string(),
    }),
  }
);
