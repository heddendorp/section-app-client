import { arg, booleanArg, list, nonNull, objectType } from 'nexus';
import { EnvelopError } from '@envelop/core';
import { DateTime, DateTime as Luxon } from 'luxon';
import { TumiEvent } from '../../generated/nexus-prisma';
import {
  MembershipStatus,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  Role,
} from '../../generated/prisma';
import { submissionTimeEnum } from '../enums';
import { eventRegistrationType } from '../eventRegistration';
import { userType } from '../user';
import { assertWrappingType } from 'graphql';

export const eventType = objectType({
  name: TumiEvent.$name,
  description: TumiEvent.$description,
  definition(t) {
    t.field(TumiEvent.id);
    t.field(TumiEvent.createdAt);
    t.field(TumiEvent.creatorId);
    t.field(TumiEvent.createdBy);
    t.field(TumiEvent.eventOrganizerId);
    t.field(TumiEvent.organizer);
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
      resolve: (source, args, context) => {
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .eventRegistrationCodes();
      },
    });
    t.field(TumiEvent.insuranceDescription);
    t.field(TumiEvent.shouldBeReportedToInsurance);
    t.nonNull.string('freeParticipantSpots', {
      resolve: (source, args, context) => {
        /*info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });*/
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => {
            const quota = registrations.length / source.participantLimit;
            if (quota < 0.5) {
              return 'Many free spots';
            } else if (quota < 0.8) {
              return 'Some spots left';
            } else if (quota < 1) {
              return 'Few spots left';
            } else if (source.participantLimit - registrations.length === 1) {
              return 'One spot left';
            } else {
              return 'Event is full';
            }
          });
      },
    });
    t.field({
      ...TumiEvent.submissionItems,
      args: { submissionTime: arg({ type: submissionTimeEnum }) },
      resolve: (source, { submissionTime }, context) => {
        // cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
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
      resolve: (source, { hideOnInvoice }, context) => {
        // cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .costItems({
            where: { ...(hideOnInvoice ? { onInvoice: false } : {}) },
          });
      },
    });
    t.field({
      ...TumiEvent.photoShares,
      resolve: (source, args, { prisma }) => {
        // cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
        return prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .photoShares();
      },
    });
    t.field(TumiEvent.eventTemplate);
    t.field(TumiEvent.eventTemplateId);
    t.nonNull.boolean('needsRating', {
      resolve: async (source, args, context) => {
        const lastWeek = DateTime.local().minus({ days: 7 });
        const registrations = await context.prisma.tumiEvent
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
    });
    t.float('participantRatings', {
      resolve: async (source, args, context) => {
        return context.prisma.eventRegistration
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
    });
    t.float('organizerRatings', {
      resolve: async (source, args, context) => {
        return context.prisma.eventRegistration
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
    });
    t.field({
      name: 'activeRegistration',
      type: eventRegistrationType,
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Private });
        if (!context.user) return null;
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              user: { id: context.user.id },
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => {
            if (registrations.length === 0) return null;
            return registrations[0];
          });
      },
    });
    t.field({
      name: 'ownRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      args: { includeCancelled: booleanArg({ default: false }) },
      resolve: (source, { includeCancelled }, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Private });
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              user: { id: context.user?.id },
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
      resolve: (source, { includeCancelled }, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
              { status: 'asc' },
              { checkInTime: 'desc' },
              { user: { lastName: 'asc' } },
            ],
          });
      },
    });
    t.field({
      name: 'organizerRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
    t.field({
      name: 'amountCollected',
      type: nonNull('Decimal'),
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
          .then(
            (aggregations) => (aggregations._sum.amount?.toNumber() ?? 0) / 100
          );
      },
    });
    t.field({
      name: 'netAmountCollected',
      type: nonNull('Decimal'),
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
          .then(
            (aggregations) =>
              (aggregations._sum.netAmount?.toNumber() ?? 0) / 100
          );
      },
    });
    t.field({
      name: 'feesPaid',
      type: nonNull('Decimal'),
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
          .then(
            (aggregations) =>
              (aggregations._sum.feeAmount?.toNumber() ?? 0) / 100
          );
      },
    });
    t.field({
      name: 'plannedSpend',
      type: 'Decimal',
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
    t.field({
      name: 'submittedSpend',
      type: 'Decimal',
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) return false;
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              user: { id: context.user.id },
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => registrations.length > 0);
      },
    });
    t.nonNull.boolean('userIsCreator', {
      resolve: (source, args, context) => {
        if (context.assignment?.role === Role.ADMIN) return true;
        if (!context.user) return false;
        return source.creatorId === context.user.id;
      },
    });
    t.nonNull.boolean('userIsOrganizer', {
      description: 'Indicates if the current user is organizer for the event',
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) return false;
        return context.prisma.tumiEvent
          .findUnique({ where: { id: source.id } })
          .registrations({
            where: {
              user: { id: context.user.id },
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((organizers) => organizers.length > 0);
      },
    });
    t.field('organizers', {
      description: 'Organizers already on this event',
      type: nonNull(list(nonNull(userType))),
      resolve: (source, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.assignment ?? {};
        if (!root.organizerSignup.includes(status ?? MembershipStatus.NONE)) {
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
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Participant signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.assignment ?? {};
        if (!root.participantSignup.includes(status ?? MembershipStatus.NONE)) {
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
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({
            where: { id: root.id },
          })
          .registrations({
            where: {
              type: RegistrationType.PARTICIPANT,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => registrations.length);
      },
    });
    t.nonNull.int('participantsAttended', {
      description: 'Number of users that are checked in on the event',
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
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
      type: nonNull('Json'),
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(`Can't register participant because user is missing`);
          }
          return { option: false, reason: 'You have to log in to register!' };
        }
        const { status } = context.assignment ?? {};
        if (!root.participantSignup.includes(status ?? MembershipStatus.NONE)) {
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
        const { days } = Luxon.fromJSDate(root.start)
          .diff(Luxon.local(), 'days')
          .toObject();
        if ((days ?? 0) > 5) {
          const registrationsOfUser =
            await context.prisma.eventRegistration.count({
              where: {
                event: {
                  start: { gt: new Date() },
                  registrationMode: RegistrationMode.STRIPE,
                },
                type: RegistrationType.PARTICIPANT,
                status: { not: RegistrationStatus.CANCELLED },
                user: { id: context.user.id },
              },
            });
          if (
            registrationsOfUser >= 6 &&
            !root.title.includes('ESNcard') &&
            !root.title.includes('Party') &&
            root.registrationMode === RegistrationMode.STRIPE
          ) {
            if (process.env.DEV) {
              console.info(
                `Can't register participant because there are too many registrations ${registrationsOfUser}`
              );
            }
            return {
              option: false,
              reason: `You are already signed up for ${registrationsOfUser} paid events that start in the future.\nTo make sure everyone has a chance to experience events you may only register for another event once you are registered for less then 5 paid events that start in the future.\nThis restriction will be lifted a few days before the event.`,
            };
          }
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
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
        return context.prisma.tumiEvent
          .findUnique({
            where: { id: root.id },
          })
          .registrations({
            where: {
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
            },
          })
          .then((registrations) => registrations.length);
      },
    });
    t.nonNull.boolean('organizerRegistrationPossible', {
      description:
        'Indicates whether the current user can register to this event as Organizer',
      resolve: async (root, args, context) => {
        // cacheControl.setCacheHint({ maxAge: 5, scope: CacheScope.Private });
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = context.assignment ?? {};
        if (!root.organizerSignup.includes(status ?? MembershipStatus.NONE)) {
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
            where: {
              type: RegistrationType.ORGANIZER,
              status: { not: RegistrationStatus.CANCELLED },
              event: { id: root.id },
            },
          });
        return currentRegistrationNum < root.organizerLimit;
      },
    });
  },
});
