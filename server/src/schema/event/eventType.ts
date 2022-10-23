import { builder } from '../../builder';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  SubmissionTime,
  TransactionDirection,
  TransactionStatus,
} from '../../generated/prisma';
import { DateTime } from 'luxon';
import prisma from '../../client';
import * as fs from 'fs';
import { marked } from 'marked';
import mjml2html from 'mjml';
import CacheService from '../../helpers/cacheService';

const signupVelocities = builder.simpleObject('signupVelocities', {
  fields: (t) => ({
    quarter: t.float({ nullable: true }),
    quarterTime: t.string({ nullable: true }),
    quarterCount: t.int({ nullable: true }),
    fifty: t.float({ nullable: true }),
    fiftyTime: t.string({ nullable: true }),
    fiftyCount: t.int({ nullable: true }),
    threequarters: t.float({ nullable: true }),
    threequartersTime: t.string({ nullable: true }),
    threequartersCount: t.int({ nullable: true }),
    ninety: t.float({ nullable: true }),
    ninetyTime: t.string({ nullable: true }),
    ninetyCount: t.int({ nullable: true }),
  }),
});

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
    organizerRegistrationStart: t.expose('organizerRegistrationStart', {
      type: 'DateTime',
    }),
    description: t.exposeString('description'),
    disableDeregistration: t.exposeBoolean('disableDeregistration'),
    excludeFromStatistics: t.exposeBoolean('excludeFromStatistics'),
    excludeFromRatings: t.exposeBoolean('excludeFromRatings'),
    coordinates: t.expose('coordinates', { type: 'JSON', nullable: true }),
    prices: t.expose('prices', { type: 'JSON', nullable: true }),
    location: t.exposeString('location'),
    googlePlaceId: t.exposeString('googlePlaceId', { nullable: true }),
    googlePlaceUrl: t.string({
      nullable: true,
      resolve: (event, args, context) => {
        if (event.googlePlaceUrl) return event.googlePlaceUrl;
        if (event.location && event.googlePlaceId) {
          return `https://www.google.com/maps/search/?api=1&query=${event.location}&query_place_id=${event.googlePlaceId}`;
        }
        return null;
      },
    }),
    registrationLink: t.exposeString('registrationLink', { nullable: true }),
    registrationMode: t.expose('registrationMode', { type: RegistrationMode }),
    participantText: t.exposeString('participantText'),
    organizerText: t.exposeString('organizerText', {
      authScopes: { member: true },
      unauthorizedResolver: () => '',
    }),
    organizerSignup: t.exposeStringList('organizerSignup'),
    internalEvent: t.boolean({
      resolve: (event, args, context) =>
        !event.participantSignup.includes(MembershipStatus.NONE),
    }),
    participantSignup: t.exposeStringList('participantSignup'),
    participantLimit: t.exposeInt('participantLimit'),
    organizerLimit: t.exposeInt('organizerLimit'),
    publicationState: t.expose('publicationState', { type: PublicationState }),
    participantRegistrationCount: t.relationCount('registrations', {
      where: {
        type: RegistrationType.PARTICIPANT,
        status: { not: RegistrationStatus.CANCELLED },
      },
    }),
    eventRegistrationCodes: t.relation('eventRegistrationCodes', {
      query: () => ({ orderBy: { createdAt: 'desc' } }),
    }),
    insuranceDescription: t.exposeString('insuranceDescription'),
    shouldBeReportedToInsurance: t.exposeBoolean('shouldBeReportedToInsurance'),
    countedParticipantRegistrations: t.relationCount('registrations', {
      where: {
        type: RegistrationType.PARTICIPANT,
        status: { not: RegistrationStatus.CANCELLED },
      },
      deprecationReason: 'has become the default',
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
      deprecationReason:
        'Use participantLimit and participantRegistrationCount instead',
      resolve: async (event, args, context) => {
        const participantCount = await prisma.eventRegistration.count({
          where: {
            event: { id: event.id },
            type: RegistrationType.PARTICIPANT,
            status: { not: RegistrationStatus.CANCELLED },
          },
        });
        const quota = participantCount / event.participantLimit;
        if (quota < 0.5) {
          return 'Many free spots';
        } else if (quota < 0.8) {
          return 'Some spots left';
        } else if (event.participantLimit - participantCount === 1) {
          return 'One spot left';
        } else if (quota < 1) {
          return 'Few spots left';
        } else {
          return 'Event is full';
        }
      },
    }),
    ratingPending: t.boolean({
      resolve: async (source, args, context) => {
        const registrations = await prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              event: {
                excludeFromRatings: false,
                end: {
                  lt: new Date(),
                },
              },
              user: { id: context.user?.id },
              status: RegistrationStatus.SUCCESSFUL,
              rating: null,
            },
          });
        return (registrations?.length ?? 0) > 0;
      },
    }),
    participantRating: t.float({
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
    participantRatingCount: t.relationCount('registrations', {
      where: {
        status: { not: RegistrationStatus.CANCELLED },
        type: RegistrationType.PARTICIPANT,
        rating: {
          not: null,
        },
      },
    }),
    organizerRating: t.float({
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
    organizerRatingCount: t.relationCount('registrations', {
      where: {
        status: { not: RegistrationStatus.CANCELLED },
        type: RegistrationType.ORGANIZER,
        rating: {
          not: null,
        },
      },
    }),
    signupVelocity: t.field({
      type: signupVelocities,
      resolve: async (event) => CacheService.getSignupVelocity(event.id),
    }),
    activeRegistration: t.prismaField({
      type: 'EventRegistration',
      nullable: true,
      authScopes: { public: true },
      unauthorizedResolver: () => null,
      resolve: async (query, parent, args, context, info) => {
        return prisma.eventRegistration.findFirst({
          ...query,
          where: {
            user: { id: context.user?.id },
            event: { id: parent.id },
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
        includePending: t.arg.boolean({ defaultValue: true }),
        includeNoShows: t.arg.boolean({ defaultValue: true }),
      },
      query: (args, context) => {
        const { status } = context.userOfTenant ?? {};
        // limit non-members to just 30
        const limit = status && status !== MembershipStatus.NONE ? 0 : 30;
        return {
          where: {
            type: RegistrationType.PARTICIPANT,
            status: {
              in: [
                RegistrationStatus.SUCCESSFUL,
                ...(args.includeCancelled
                  ? [RegistrationStatus.CANCELLED]
                  : []),
                ...(args.includePending ? [RegistrationStatus.PENDING] : []),
              ],
            },
            ...(args.includeNoShows ? {} : { checkInTime: { not: null } }),
          },
          orderBy: [
            { status: 'asc' },
            { checkInTime: 'desc' },
            { user: { lastName: 'asc' } },
          ],
          ...(limit ? { take: limit } : {}),
        };
      },
    }),
    organizerRegistrations: t.relation('registrations', {
      query: (args, context) => ({
        where: {
          type: RegistrationType.ORGANIZER,
          status: { not: RegistrationStatus.CANCELLED },
        },
      }),
    }),
    ratings: t.relation('registrations', {
      query: (args, context) => {
        const { role, status } = context.userOfTenant ?? {};
        return {
          where: {
            ...(!status || status === MembershipStatus.NONE
              ? { type: RegistrationType.PARTICIPANT }
              : { status: { not: RegistrationStatus.CANCELLED } }),
            rating: {
              not: null,
            },
          },
          orderBy: [{ type: 'asc' }, { user: { lastName: 'asc' } }],
        };
      },
    }),
    amountCollected: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.transaction
          .aggregate({
            where: {
              direction: TransactionDirection.USER_TO_TUMI,
              eventRegistration: {
                event: { id: source.id },
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount?.toNumber() ?? 0)
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
    netAmountCollected: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return Promise.all([
          prisma.transaction.aggregate({
            where: {
              direction: TransactionDirection.USER_TO_TUMI,
              eventRegistration: {
                event: { id: source.id },
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              direction: TransactionDirection.TUMI_TO_EXTERNAL,
              eventRegistration: {
                event: { id: source.id },
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              direction: TransactionDirection.TUMI_TO_USER,
              eventRegistration: {
                event: { id: source.id },
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          }),
        ])
          .then((aggregations) =>
            aggregations.map(
              (aggregation) => aggregation._sum.amount?.toNumber() ?? 0
            )
          )
          .then(
            ([incoming, fees, refunds]) =>
              new Prisma.Decimal(incoming - fees - refunds)
          );
      },
    }),
    feesPaid: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.transaction
          .aggregate({
            where: {
              direction: TransactionDirection.TUMI_TO_EXTERNAL,
              eventRegistration: {
                event: { id: source.id },
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount?.toNumber() ?? 0)
          .then((amount) => new Prisma.Decimal(amount));
      },
    }),
    refundFeesPaid: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.transaction
          .aggregate({
            where: {
              eventRegistration: {
                event: { id: source.id },
                status: RegistrationStatus.CANCELLED,
              },
              direction: TransactionDirection.TUMI_TO_EXTERNAL,
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          })
          .then(
            (aggregations) => (aggregations._sum.amount?.toNumber() ?? 0) / 100
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
          .then((registrations) => (registrations?.length ?? 0) > 0);
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
          .then((organizers) => (organizers?.length ?? 0) > 0);
      },
    }),
    organizers: t.prismaField({
      type: ['User'],
      authScopes: {
        authenticated: true,
      },
      unauthorizedResolver: () => [],
      resolve: async (query, parent, args, context) => {
        return (
          await prisma.eventRegistration.findMany({
            where: {
              event: { id: parent.id },
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
            },
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              user: true,
            },
          })
        ).map((r) => r.user);
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
              'Signup not possible because of missing status ' + status
            );
          }
          return false;
        }
        return true;
      },
    }),
    participantsAttended: t.relationCount('registrations', {
      where: {
        status: { not: RegistrationStatus.CANCELLED },
        type: RegistrationType.PARTICIPANT,
        checkInTime: { not: null },
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
        const registrationNumToday = await prisma.eventRegistration.count({
          where: {
            userId: context.user?.id,
            createdAt: {
              gte: DateTime.local().startOf('day').toJSDate(),
            },
            event: { registrationMode: RegistrationMode.STRIPE },
            NOT: {
              event: {
                title: {
                  contains: 'ESNcard',
                },
              },
            },
            status: { not: RegistrationStatus.CANCELLED },
          },
        });
        if (registrationNumToday >= 3) {
          if (process.env.DEV) {
            console.info(
              `Can't register participant because there are already 3 registrations today`
            );
          }
          return {
            option: false,
            reason: 'You have already registered for 3 events today!',
          };
        }
        const eventParticipantRegistrations =
          await prisma.eventRegistration.count({
            where: {
              event: {
                id: parent.id,
              },
              status: { not: RegistrationStatus.CANCELLED },
              type: RegistrationType.PARTICIPANT,
            },
          });
        if (eventParticipantRegistrations >= parent.participantLimit) {
          if (process.env.DEV) {
            console.info(
              `Can't register because to many people are on event ${eventParticipantRegistrations} >= ${parent.participantLimit}`
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
    organizersRegistered: t.relationCount('registrations', {
      where: {
        status: { not: RegistrationStatus.CANCELLED },
        type: RegistrationType.ORGANIZER,
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
    mailTemplate: t.string({
      resolve: async (event, args, context) => {
        const participatedText = marked(event.participantText);

        const [icon, style] = (event.icon ?? '').split(':');
        const iconUrl = `https://img.icons8.com/${style ?? 'fluency'}/64/${
          icon ?? 'cancel-2'
        }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;

        const date = DateTime.fromJSDate(event.start);
        const intro = `Hi,<br/>thank you for signing up for the event on ${date.weekdayLong}!`;

        let template = fs
          .readFileSync(
            __dirname + '/../../assets' + '/mailTemplate.mjml',
            'utf8'
          )
          .replaceAll('%title%', event.title)
          .replaceAll('%preview%', intro)
          .replaceAll('%intro%', intro)
          .replaceAll('%weekday%', date.weekdayLong)
          .replaceAll('%icon%', iconUrl)
          .replaceAll('%url%', `https://tumi.esn.world/events/${event.id}`)
          .replaceAll('%location%', event.location)
          .replaceAll('%time%', date.toFormat('HH:mm'))
          .replaceAll('%body%', participatedText);

        const imgSrcMatch = /<img[^>]+src="([^">]+)"/gm.exec(
          marked(event.description)
        );
        if (imgSrcMatch) {
          template = template
            .replaceAll('%photo%', imgSrcMatch[1])
            .replace('<!--', '')
            .replace('-->', '');
        }
        const organizerMails = await prisma.tumiEvent
          .findUnique({ where: { id: event.id } })
          .registrations({
            where: {
              type: RegistrationType.ORGANIZER,
              status: RegistrationStatus.SUCCESSFUL,
            },
            select: { user: { select: { email: true } } },
          })
          .then((r) => r?.map((re) => re.user.email));

        const participantMails = await prisma.tumiEvent
          .findUnique({ where: { id: event.id } })
          .registrations({
            where: {
              type: RegistrationType.PARTICIPANT,
              status: RegistrationStatus.SUCCESSFUL,
            },
            select: {
              user: { select: { email: true, communicationEmail: true } },
            },
          })
          .then((r) =>
            r?.map((re) => re.user.communicationEmail || re.user.email)
          );

        let email = 'To: events@esn-tumi.de\n';
        email += `Cc: ${organizerMails?.join(';')}\n`;
        email += `Bcc: ${participantMails?.join(';')}\n`;
        email += `Subject: [TUMi] ${event.title}\n`;
        email += 'X-Unsent: 1\n';
        email += 'Content-Type: text/html; charset=utf-8\n\n';
        email += mjml2html(template).html;

        return email;
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
      organizerRegistrationStart: t.field({ type: 'DateTime' }),
      shouldBeReportedToInsurance: t.boolean(),
      eventOrganizerId: t.id({ required: true }),
      start: t.field({ type: 'DateTime' }),
      title: t.string(),
    }),
  }
);
