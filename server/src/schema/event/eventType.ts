import { builder } from '../../builder';
import {
  Prisma,
  PublicationState,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  SubmissionTime,
} from '../../generated/prisma';
import { DateTime } from 'luxon';
import prisma from '../../client';

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
    coordinates: t.expose('coordinates', { type: 'JSON' }),
    location: t.exposeString('location'),
    registrationLink: t.exposeString('registrationLink', { nullable: true }),
    registrationMode: t.expose('registrationMode', { type: RegistrationMode }),
    participantText: t.exposeString('participantText'),
    organizerText: t.exposeString('organizerText'),
    organizerSignup: t.exposeStringList('organizerSignup'),
    participantSignup: t.exposeStringList('participantSignup'),
    publicationState: t.expose('publicationState', { type: PublicationState }),
    participantRegistrationCount: t.exposeInt('participantRegistrationCount'),
    eventRegistrationCodes: t.relation('eventRegistrationCodes'),
    insuranceDescription: t.exposeString('insuranceDescription'),
    shouldBeReportedToInsurance: t.exposeBoolean('shouldBeReportedToInsurance'),
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
    needsRating: t.boolean({
      resolve: async (source, args, context) => {
        const lastWeek = DateTime.local().minus({ days: 7 });
        const registrations = await prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              event: {
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
      resolve: async (query, parent, args, context, info) => {
        return prisma.eventRegistration.findFirst({
          ...query,
          where: {
            user: { id: context.user?.id },
            status: { not: RegistrationStatus.CANCELLED },
          },
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
    ammountCollected: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.stripePayment
          .aggregate({
            where: {
              transaction: {
                eventRegistration: {
                  event: { id: source.id },
                  status: { not: RegistrationStatus.CANCELLED },
                },
              },
              amount: { not: undefined },
            },
            _sum: { amount: true },
          })
          .then(
            (aggregations) => (aggregations._sum.amount?.toNumber() ?? 0) / 100
          )
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
  }),
});
