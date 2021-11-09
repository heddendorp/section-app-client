import {
  arg,
  booleanArg,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { TumiEvent } from 'nexus-prisma';
import { UserInputError } from 'apollo-server-core';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  Role,
} from '@tumi/server-models';
import {
  publicationStateEnum,
  registrationTypeEnum,
  submissionTimeEnum,
} from './enums';
import { userType } from './user';
import { eventRegistrationType } from './eventRegistration';
import { ApolloError } from 'apollo-server-express';
import { DateTime, Json } from 'nexus-prisma/scalars';
import { DateTime as Luxon } from 'luxon';
import { updateLocationInputType } from './eventTemplate';
import { CacheScope } from 'apollo-server-types';
import { RegistrationService } from '@tumi/server/services';
import TumiEventWhereInput = Prisma.TumiEventWhereInput;

export const eventType = objectType({
  name: TumiEvent.$name,
  description: TumiEvent.$description,
  definition(t) {
    t.field(TumiEvent.id);
    t.field(TumiEvent.createdAt);
    t.field(TumiEvent.creatorId);
    t.field({
      ...TumiEvent.createdBy,
      resolve: (source, args, { prisma }, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return prisma.user.findUnique({ where: { id: source.creatorId } });
      },
    });
    t.field(TumiEvent.eventOrganizerId);
    t.field({
      ...TumiEvent.organizer,
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return context.prisma.eventOrganizer.findUnique({
          where: { id: source.eventOrganizerId },
        });
      },
    });
    t.field(TumiEvent.title);
    t.field(TumiEvent.icon);
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.registrationStart);
    t.field(TumiEvent.description);
    t.field(TumiEvent.coordinates);
    t.field(TumiEvent.location);
    t.field(TumiEvent.registrationLink);
    t.field(TumiEvent.registrationMode);
    t.field(TumiEvent.participantText);
    t.field(TumiEvent.organizerText);
    t.field(TumiEvent.prices);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.field(TumiEvent.organizerSignup);
    t.field(TumiEvent.participantSignup);
    t.field(TumiEvent.publicationState);
    t.field({
      ...TumiEvent.eventRegistrationCodes,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .eventRegistrationCodes();
      },
    });
    t.nonNull.string('freeParticipantSpots', {
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.eventRegistration
          .count({
            where: {
              eventId: source.id,
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => {
            const quota = registrations / source.participantLimit;
            if (quota < 0.5) {
              return 'Many free spots';
            } else if (quota < 0.8) {
              return 'Some spots left';
            } else if (quota < 1) {
              return 'Few spots left';
            } else {
              return 'Event is full';
            }
          });
      },
    });
    t.field({
      ...TumiEvent.submissionItems,
      args: { submissionTime: arg({ type: submissionTimeEnum }) },
      resolve: (source, { submissionTime }, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({
            where: {
              id: source.id,
            },
          })
          .submissionItems({
            where: { ...(submissionTime ? { submissionTime } : {}) },
          });
      },
    });
    t.field({
      ...TumiEvent.costItems,
      args: { hideOnInvoice: booleanArg({ default: false }) },
      resolve: (source, { hideOnInvoice }, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .costItems({
            where: { ...(hideOnInvoice ? { onInvoice: false } : {}) },
          });
      },
    });
    t.field({
      ...TumiEvent.photoShares,
      resolve: (source, args, { prisma }, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .photoShares();
      },
    });
    t.field({
      ...TumiEvent.eventTemplate,
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return context.prisma.eventTemplate.findUnique({
          where: { id: source.eventTemplateId },
        });
      },
    });
    t.field(TumiEvent.eventTemplateId);
    t.field({
      name: 'activeRegistration',
      type: eventRegistrationType,
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Private });
        return context.prisma.eventRegistration.findFirst({
          where: {
            event: { id: source.id },
            user: { id: context.user.id },
            status: { not: RegistrationStatus.CANCELLED },
          },
        });
      },
    });
    t.field({
      name: 'ownRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      args: { includeCancelled: booleanArg({ default: false }) },
      resolve: (source, { includeCancelled }, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Private });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              user: { id: context.user.id },
              ...(includeCancelled
                ? { status: { not: RegistrationStatus.CANCELLED } }
                : {}),
            },
          });
      },
    });
    t.field({
      name: 'participantRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      args: { includeCancelled: booleanArg({ default: false }) },
      resolve: (source, { includeCancelled }, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              type: RegistrationType.PARTICIPANT,
              ...(includeCancelled
                ? {}
                : { status: { not: RegistrationStatus.CANCELLED } }),
            },
            orderBy: [
              { status: 'desc' },
              { checkInTime: 'desc' },
              { user: { lastName: 'asc' } },
            ],
          });
      },
    });
    t.field({
      name: 'organizerRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
            },
            orderBy: [{ user: { lastName: 'asc' } }],
          });
      },
    });
    t.nonNull.decimal('amountCollected', {
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.stripePayment
          .aggregate({
            where: {
              eventRegistration: {
                event: { id: source.id },
                status: { not: RegistrationStatus.CANCELLED },
              },
              amount: { not: undefined },
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount.toNumber() / 100);
      },
    });
    t.nonNull.decimal('netAmountCollected', {
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.stripePayment
          .aggregate({
            where: {
              eventRegistration: {
                event: { id: source.id },
                status: { not: RegistrationStatus.CANCELLED },
              },
              netAmount: { not: undefined },
            },
            _sum: { netAmount: true },
          })
          .then((aggregations) => aggregations._sum.netAmount.toNumber() / 100);
      },
    });
    t.nonNull.decimal('feesPaid', {
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.stripePayment
          .aggregate({
            where: {
              eventRegistration: {
                event: { id: source.id },
                status: { not: RegistrationStatus.CANCELLED },
              },
              feeAmount: { not: undefined },
            },
            _sum: { feeAmount: true },
          })
          .then((aggregations) => aggregations._sum.feeAmount.toNumber() / 100);
      },
    });
    t.decimal('plannedSpend', {
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.costItem
          .aggregate({
            where: {
              event: { id: source.id },
              amount: { not: undefined },
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount);
      },
    });
    t.decimal('submittedSpend', {
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.receipt
          .aggregate({
            where: {
              costItem: { event: { id: source.id } },
              amount: { not: undefined },
            },
            _sum: { amount: true },
          })
          .then((aggregations) => aggregations._sum.amount);
      },
    });
    t.nonNull.boolean('userRegistered', {
      description: 'Indicates if the current user is registered for the event',
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) return false;
        return context.prisma.eventRegistration
          .count({
            where: {
              eventId: source.id,
              userId: context.user.id,
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((number) => number !== 0);
      },
    });
    t.nonNull.boolean('userIsCreator', {
      resolve: (source, args, context) => {
        if (context.assignment.role === Role.ADMIN) return true;
        return source.creatorId === context.user.id;
      },
    });
    t.nonNull.boolean('userIsOrganizer', {
      description: 'Indicates if the current user is organizer for the event',
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) return false;
        return context.prisma.eventRegistration
          .count({
            where: {
              eventId: source.id,
              userId: context.user.id,
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((number) => number !== 0);
      },
    });
    t.field('organizers', {
      description: 'Organizers already on this event',
      type: nonNull(list(nonNull(userType))),
      resolve: (source, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.user.findMany({
          where: {
            eventRegistrations: {
              some: {
                eventId: source.id,
                type: RegistrationType.ORGANIZER,
                status: { not: RegistrationStatus.CANCELLED },
              },
            },
          },
        });
      },
    });
    t.nonNull.boolean('couldBeOrganizer', {
      description:
        'Indicates whether the user could be an organizer for this event',
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.assignment;
        if (!root.organizerSignup.includes(status)) {
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
    });
    t.nonNull.boolean('couldBeParticipant', {
      description:
        'Indicates whether the user could be a participant for this event',
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Participant signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.assignment;
        if (!root.participantSignup.includes(status)) {
          if (process.env.DEV) {
            console.info(
              'Participant signup not possible because of missing status ' +
                status
            );
          }
          return false;
        }
        return true;
      },
    });
    t.nonNull.int('participantsRegistered', {
      description: 'Number of users registered as participant to this event',
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            type: RegistrationType.PARTICIPANT,
            status: { not: RegistrationStatus.CANCELLED },
          },
        });
      },
    });
    t.nonNull.int('participantsAttended', {
      description: 'Number of users that are checked in on the event',
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            type: RegistrationType.PARTICIPANT,
            status: { not: RegistrationStatus.CANCELLED },
            checkInTime: { not: null },
          },
        });
      },
    });
    t.field({
      name: 'participantRegistrationPossible',
      description:
        'Indicates whether the current user can register to this event as participant',
      type: nonNull(Json),
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(`Can't register participant because user is missing`);
          }
          return { option: false, reason: 'You have to log in to register!' };
        }
        const { status } = context.assignment;
        if (!root.participantSignup.includes(status)) {
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
        const previousRegistration =
          await context.prisma.eventRegistration.findFirst({
            where: {
              userId: context.user.id,
              eventId: root.id,
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
        const registrationsOfUser =
          await context.prisma.eventRegistration.count({
            where: {
              event: {
                start: { gt: new Date() },
                registrationMode: RegistrationMode.STRIPE,
                id: {
                  notIn: [
                    'c486c0ad-c07f-48cd-a330-203ed8b59740',
                    '998851e2-17af-482c-99cb-99a29b543d60',
                  ],
                },
              },
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
              user: { id: context.user.id },
            },
          });
        const { hours } = Luxon.fromJSDate(root.start)
          .diff(Luxon.local(), 'hours')
          .toObject();
        if (
          registrationsOfUser >= 5 &&
          !root.title.includes('ESNcard') &&
          !root.title.includes('Party') &&
          hours > 30 &&
          root.registrationMode === RegistrationMode.STRIPE
        ) {
          if (process.env.DEV) {
            console.info(
              `Can't register participant because there are too many registrations ${registrationsOfUser}`
            );
          }
          return {
            option: false,
            reason: `You are already signed up for ${registrationsOfUser} paid events that start in the future.\nTo make sure everyone has a chance to experience events you may only register for another event once you are registered for less then 5 paid events that start in the future.`,
          };
        }
        const currentRegistrationNum =
          await context.prisma.eventRegistration.count({
            where: {
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
              event: { id: root.id },
            },
          });
        if (currentRegistrationNum >= root.participantLimit) {
          if (process.env.DEV) {
            console.info(
              `Can't register because to many people are on event ${currentRegistrationNum} >= ${root.participantLimit}`
            );
          }
          return {
            option: false,
            reason: `This event is already at capacity!\nYou can check back at a later time in case spots become available.`,
          };
        }
        return { option: true };
      },
    });
    t.nonNull.int('organizersRegistered', {
      description: 'Number of users registered as organizer to this event',
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            status: { not: RegistrationStatus.CANCELLED },
            type: RegistrationType.ORGANIZER,
          },
        });
      },
    });
    t.nonNull.boolean('organizerRegistrationPossible', {
      description:
        'Indicates whether the current user can register to this event as Organizer',
      resolve: async (root, args, context, { cacheControl }) => {
        cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.assignment;
        if (!root.organizerSignup.includes(status)) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing status ' +
                status
            );
          }
          return false;
        }
        const previousRegistration =
          await context.prisma.eventRegistration.findFirst({
            where: {
              userId: context.user.id,
              eventId: root.id,
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
        const currentRegistrationNum =
          await context.prisma.eventRegistration.count({
            where: { type: RegistrationType.ORGANIZER, event: { id: root.id } },
          });
        return currentRegistrationNum < root.organizerLimit;
      },
    });
  },
});

export const updateCostItemsFromTemplateMutation = mutationField(
  'updateCostItemsFromTemplate',
  {
    type: eventType,
    args: { eventId: nonNull(idArg()) },
    resolve: (source, { eventId }, context) =>
      context.prisma.$transaction(async (prisma) => {
        const event = await prisma.tumiEvent.findUnique({
          where: { id: eventId },
        });
        const template = await prisma.eventTemplate.findUnique({
          where: { id: event.eventTemplateId },
        });
        if (
          typeof template.finances !== 'object' ||
          Array.isArray(template.finances) ||
          !Array.isArray(template.finances.items)
        ) {
          throw new ApolloError('No items found in template finances');
        }
        await prisma.costItem.deleteMany({ where: { event: { id: eventId } } });
        const items = template.finances.items as {
          description: string;
          value: number;
          type: string;
          prepaid: boolean;
          details: string;
          scale?: number;
        }[];
        await prisma.costItem.createMany({
          data: items.map((item) => {
            let amount;
            let calculationInfo;
            const allParticipants =
              event.participantLimit + event.organizerLimit;
            switch (item.type) {
              case 'event':
                amount = item.value;
                calculationInfo = `${item.value}€ per event`;
                break;
              case 'participant':
                amount = item.value * allParticipants;
                calculationInfo = `${allParticipants} x ${item.value}€ per participant`;
                break;
              default:
                amount =
                  item.value * Math.ceil(allParticipants / (item.scale ?? 1));
                calculationInfo = `${Math.ceil(
                  allParticipants / (item.scale ?? 1)
                )} x ${item.value}€ per ${item.scale ?? 1} participants`;
            }
            return {
              eventId,
              onInvoice: item.prepaid,
              amount: amount,
              calculationInfo,
              details: item.details,
              name: item.description,
            };
          }),
        });
        return event;
      }),
  }
);

export const createEventFromTemplateInput = inputObjectType({
  name: 'CreateEventFromTemplateInput',
  description: 'Additional inputs to create an event from a template',
  definition(t) {
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.field(TumiEvent.registrationLink);
    t.field(TumiEvent.registrationMode);
    t.nonNull.id('organizerId');
    t.int('price');
  },
});

export const updateGeneralEventInput = inputObjectType({
  name: 'UpdateGeneralEventInput',
  description: 'Additional inputs to create an event from a template',
  definition(t) {
    t.field(TumiEvent.description);
    t.field(TumiEvent.organizerText);
    t.field(TumiEvent.participantText);
  },
});
export const updateCoreEventInput = inputObjectType({
  name: 'UpdateCoreEventInput',
  description: 'Additional inputs to create an event from a template',
  definition(t) {
    t.field(TumiEvent.title);
    t.field(TumiEvent.icon);
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.registrationStart);
    t.field(TumiEvent.registrationMode);
    t.field(TumiEvent.registrationLink);
    t.field(TumiEvent.organizerSignup);
    t.field(TumiEvent.participantSignup);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.field(TumiEvent.prices);
    t.id('eventOrganizerId');
  },
});

export const getAllEventsQuery = queryField('events', {
  description: 'Get a list of all events',
  type: nonNull(list(nonNull(eventType))),
  args: { after: arg({ type: DateTime }), userId: idArg() },
  resolve: async (source, { after, userId }, context, { cacheControl }) => {
    cacheControl.setCacheHint({ scope: CacheScope.Private, maxAge: 10 });
    let where: TumiEventWhereInput;
    after ??= new Date();
    const { role, status } = context.assignment ?? {};
    if (!context.user) {
      where = {
        participantSignup: {
          has: MembershipStatus.NONE,
        },
        end: { gt: new Date() },
        publicationState: PublicationState.PUBLIC,
      };
    } else if (role === Role.ADMIN) {
      where = { end: { gt: after } };
    } else {
      where = {
        end: { gt: after },
        OR: [
          {
            participantSignup: {
              has: status,
            },
            publicationState: PublicationState.PUBLIC,
          },
          {
            createdBy: { id: context.user.id },
          },
          {
            organizerSignup: { has: status },
            publicationState: {
              in: [PublicationState.PUBLIC, PublicationState.ORGANIZERS],
            },
          },
        ],
      };
    }
    if (userId) {
      // where.registrations.some.user.id = userId;
    }
    return context.prisma.tumiEvent.findMany({
      orderBy: { start: 'asc' },
      where,
    });
  },
});

export const getOneEventQuery = queryField('event', {
  description: 'Get one event by ID',
  type: nonNull(eventType),
  args: { eventId: nonNull(idArg()) },
  resolve: (source, { eventId }, context, { cacheControl }) => {
    cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
    return context.prisma.tumiEvent.findUnique({ where: { id: eventId } });
  },
});

export const updateEventLocationMutation = mutationField(
  'updateEventLocation',
  {
    type: eventType,
    description: 'Update an event template',
    args: { id: nonNull(idArg()), data: nonNull(updateLocationInputType) },
    resolve: async (source, { id, data }, context) => {
      const event = await context.prisma.tumiEvent.findUnique({
        where: { id },
      });
      const { role } = context.assignment;
      if (role !== Role.ADMIN && context.user.id !== event.creatorId) {
        throw new ApolloError(
          'Only Admins can change events they did not create'
        );
      }
      return context.prisma.tumiEvent.update({ where: { id }, data });
    },
  }
);

export const addOrganizerMutation = mutationField('addOrganizerToEvent', {
  description: 'Adds the user with the supplied id to the event',
  args: {
    eventId: nonNull(idArg()),
    userId: nonNull(idArg()),
  },
  type: eventType,
  resolve: async (source, { eventId, userId }, context) => {
    const event = await context.prisma.tumiEvent.findUnique({
      where: { id: eventId },
    });
    const { role } = context.assignment;
    if (role !== Role.ADMIN && context.user.id !== event.creatorId) {
      throw new ApolloError(
        'Only Admins can change events they did not create'
      );
    }
    return context.prisma.tumiEvent.update({
      where: { id: eventId },
      data: {
        registrations: {
          create: {
            type: RegistrationType.ORGANIZER,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  },
});

export const changePublicationMutation = mutationField(
  'changeEventPublication',
  {
    description: 'Change the publication state of an event',
    type: eventType,
    args: {
      id: nonNull(idArg()),
      state: nonNull(arg({ type: publicationStateEnum })),
    },
    resolve: async (source, { id, state }, context) => {
      const event = await context.prisma.tumiEvent.findUnique({
        where: { id },
      });
      const { role } = context.assignment;
      if (
        (state === PublicationState.PUBLIC ||
          state === PublicationState.ORGANIZERS) &&
        role !== Role.ADMIN
      ) {
        throw new ApolloError('Only admins can publish events!');
      }
      if (role !== Role.ADMIN && context.user.id !== event.creatorId) {
        throw new ApolloError(
          'Only Admins can change events they did not create'
        );
      }
      return context.prisma.tumiEvent.update({
        where: { id },
        data: { publicationState: state },
      });
    },
  }
);

export const deregisterFromEventMutation = mutationField(
  'deregisterFromEvent',
  {
    args: {
      registrationId: nonNull(idArg()),
      withRefund: booleanArg({ default: true }),
    },
    type: eventType,
    resolve: async (source, { registrationId, withRefund }, context) => {
      let isKick = false;
      const registration = await context.prisma.eventRegistration.findUnique({
        where: { id: registrationId },
      });
      if (
        registration.userId !== context.user.id &&
        context.assignment.role !== 'ADMIN'
      ) {
        throw new ApolloError('Only admins can deregister other users');
      }
      if (registration.userId !== context.user.id) {
        const user = await context.prisma.user.findUnique({
          where: { id: registration.userId },
        });
        const event = await context.prisma.tumiEvent.findUnique({
          where: { id: registration.eventId },
        });
        isKick = true;
        await context.prisma.activityLog.create({
          data: {
            severity: 'INFO',
            category: 'event-kick',
            message: `${
              registration.type === RegistrationType.PARTICIPANT
                ? 'Participant'
                : 'Organizer'
            } was removed ${withRefund ? 'with' : 'without'} refund by ${
              context.user.firstName
            } ${context.user.lastName}`,
            data: JSON.parse(JSON.stringify(registration)),
            oldData: {
              user: JSON.parse(JSON.stringify(user)),
              event: JSON.parse(JSON.stringify(event)),
            },
          },
        });
      }
      return RegistrationService.cancelRegistration(
        registrationId,
        withRefund,
        isKick,
        context
      );
    },
  }
);

export const registerForEvent = mutationField('registerForEvent', {
  type: nonNull(eventType),
  args: {
    registrationType: arg({
      type: registrationTypeEnum,
      default: RegistrationType.PARTICIPANT,
    }),
    submissions: arg({ type: Json }),
    price: arg({ type: Json }),
    eventId: nonNull(idArg()),
  },
  resolve: (
    source,
    { registrationType, eventId, submissions, price },
    context
  ) =>
    context.prisma.$transaction(async (prisma) => {
      const event = await prisma.tumiEvent.findUnique({
        where: { id: eventId },
      });
      const { status } = context.assignment;
      const allowedStatus =
        registrationType === RegistrationType.PARTICIPANT
          ? event.participantSignup
          : event.organizerSignup;
      if (!allowedStatus.includes(status)) {
        throw new ApolloError(
          'User does not fulfill the requirements to sign up!'
        );
      }
      const ownRegistration = await prisma.eventRegistration.findFirst({
        where: {
          userId: context.user.id,
          eventId,
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      if (ownRegistration) {
        throw new ApolloError('You are already registered for this event!');
      }
      const registeredUsers = await prisma.eventRegistration.count({
        where: {
          eventId,
          type: registrationType,
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      const maxRegistrations =
        registrationType === RegistrationType.PARTICIPANT
          ? event.participantLimit
          : event.organizerLimit;
      if (registeredUsers >= maxRegistrations) {
        throw new ApolloError('Event does not have an available spot!');
      }
      const baseUrl = process.env.DEV
        ? `http://localhost:4200/events/${eventId}`
        : `https://tumi.esn.world/events/${eventId}`;
      return await RegistrationService.registerOnEvent(
        context,
        prisma,
        eventId,
        context.user.id,
        registrationType,
        submissions,
        price,
        `${baseUrl}?cancel=true`,
        `${baseUrl}?success=true`
      );
    }),
});

export const updateGeneralEventMutation = mutationField(
  'updateEventGeneralInfo',
  {
    type: nonNull(eventType),
    args: {
      id: nonNull(idArg()),
      data: nonNull(updateGeneralEventInput),
    },
    resolve: async (source, { id, data }, context) => {
      const event = await context.prisma.tumiEvent.findUnique({
        where: { id },
      });
      const { role } = context.assignment;
      if (role !== Role.ADMIN && event.creatorId !== context.user.id) {
        throw new ApolloError(
          'Only Admins can update events that are not their own'
        );
      }
      return context.prisma.tumiEvent.update({
        where: {
          id,
        },
        data,
      });
    },
  }
);
export const updateCoreEventMutation = mutationField('updateEventCoreInfo', {
  type: nonNull(eventType),
  args: {
    id: nonNull(idArg()),
    data: nonNull(updateCoreEventInput),
  },
  resolve: async (source, { id, data }, context) => {
    const event = await context.prisma.tumiEvent.findUnique({ where: { id } });
    const { role } = context.assignment;
    if (role !== Role.ADMIN && event.creatorId !== context.user.id) {
      throw new ApolloError(
        'Only Admins can update events that are not their own'
      );
    }
    if (
      event.publicationState !== PublicationState.DRAFT &&
      role !== Role.ADMIN
    ) {
      throw new ApolloError('Only admins can edit published Events');
    }
    return context.prisma.tumiEvent.update({
      where: {
        id,
      },
      data,
    });
  },
});

export const createFromTemplateMutation = mutationField(
  'createEventFromTemplate',
  {
    description: 'Creates a new event from a given Template',
    type: eventType,
    args: {
      templateId: nonNull(idArg()),
      createEventFromTemplateInput: nonNull(createEventFromTemplateInput),
    },
    resolve: async (
      source,
      { templateId, createEventFromTemplateInput },
      context
    ) => {
      const template = await context.prisma.eventTemplate.findUnique({
        where: { id: templateId },
      });
      if (!template) {
        throw new UserInputError(
          'Template with the given ID could not be found'
        );
      }
      return context.prisma.tumiEvent.create({
        data: {
          title: template.title,
          icon: template.icon,
          start: createEventFromTemplateInput.start,
          end: createEventFromTemplateInput.end,
          participantLimit: createEventFromTemplateInput.participantLimit,
          organizerLimit: createEventFromTemplateInput.organizerLimit,
          registrationLink: createEventFromTemplateInput.registrationLink,
          registrationMode: createEventFromTemplateInput.registrationMode,
          description: template.description,
          coordinates: template.coordinates,
          location: template.location,
          participantText: template.participantText,
          organizerText: template.organizerText,
          ...(createEventFromTemplateInput.registrationMode ===
          RegistrationMode.STRIPE
            ? {
                prices: {
                  options: [
                    {
                      amount: createEventFromTemplateInput.price,
                      defaultPrice: true,
                      esnCardRequired: false,
                      allowedStatusList: [
                        MembershipStatus.NONE,
                        MembershipStatus.TRIAL,
                        MembershipStatus.FULL,
                        MembershipStatus.SPONSOR,
                        MembershipStatus.ALUMNI,
                      ],
                    },
                  ],
                },
              }
            : {}),
          createdBy: { connect: { id: context.user.id } },
          participantSignup: [
            MembershipStatus.NONE,
            MembershipStatus.TRIAL,
            MembershipStatus.FULL,
            MembershipStatus.SPONSOR,
            MembershipStatus.ALUMNI,
          ],
          organizerSignup: [MembershipStatus.TRIAL, MembershipStatus.FULL],
          organizer: {
            connect: {
              id: createEventFromTemplateInput.organizerId,
            },
          },
          eventTemplate: {
            connect: {
              id: template.id,
            },
          },
        },
      });
    },
  }
);
