import {
  arg,
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
  PublicationState,
  RegistrationMode,
  RegistrationType,
  Role,
} from '@tumi/server-models';
import { publicationStateEnum, registrationTypeEnum } from './enums';
import { userType } from './user';
import { eventRegistrationType } from './eventRegistration';
import { ApolloError } from 'apollo-server-express';
import { DateTime, Json } from 'nexus-prisma/scalars';

export const eventType = objectType({
  name: TumiEvent.$name,
  description: TumiEvent.$description,
  definition(t) {
    t.field(TumiEvent.id);
    t.field(TumiEvent.createdAt);
    t.field(TumiEvent.createdBy);
    t.field(TumiEvent.eventOrganizerId);
    t.field({
      ...TumiEvent.organizer,
      resolve: (source, args, context) =>
        context.prisma.eventOrganizer.findUnique({
          where: { id: source.eventOrganizerId },
        }),
    });
    t.field(TumiEvent.title);
    t.field(TumiEvent.icon);
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.description);
    t.field(TumiEvent.locationId);
    t.field(TumiEvent.location);
    t.field(TumiEvent.price);
    t.field(TumiEvent.registrationLink);
    t.field(TumiEvent.registrationMode);
    t.field(TumiEvent.participantText);
    t.field(TumiEvent.participantMail);
    t.field(TumiEvent.organizerText);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.field(TumiEvent.organizerSignup);
    t.field(TumiEvent.participantSignup);
    t.field(TumiEvent.publicationState);
    // t.field(TumiEvent.submissionItems);
    // t.field(TumiEvent.registrations);
    // t.field(TumiEvent.costItems);
    t.field(TumiEvent.photoShare);
    t.field(TumiEvent.eventTemplate);
    t.field(TumiEvent.eventTemplateId);
    t.field({
      name: 'registration',
      type: eventRegistrationType,
      resolve: (source, args, context) =>
        context.prisma.eventRegistration.findFirst({
          where: { event: { id: source.id }, user: { id: context.user.id } },
        }),
    });
    t.field({
      name: 'participantRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      resolve: (source, args, context) =>
        context.prisma.eventRegistration.findMany({
          where: {
            type: RegistrationType.PARTICIPANT,
            event: { id: source.id },
          },
          orderBy: [{ checkInTime: 'desc' }, { user: { lastName: 'asc' } }],
        }),
    });
    t.field({
      name: 'organizerRegistrations',
      type: nonNull(list(nonNull(eventRegistrationType))),
      resolve: (source, args, context) =>
        context.prisma.eventRegistration.findMany({
          where: {
            type: RegistrationType.ORGANIZER,
            event: { id: source.id },
          },
          orderBy: { createdAt: 'desc' },
        }),
    });
    t.int('amountCollected', {
      resolve: (source, args, context) =>
        context.prisma.eventRegistration
          .aggregate({
            where: {
              event: { id: source.id },
              amountPaid: { not: null },
            },
            _sum: { amountPaid: true },
          })
          .then((aggregations) => aggregations._sum.amountPaid),
    });
    t.int('netAmountCollected', {
      resolve: (source, args, context) =>
        context.prisma.eventRegistration
          .aggregate({
            where: {
              event: { id: source.id },
              netPaid: { not: null },
            },
            _sum: { netPaid: true },
          })
          .then((aggregations) => aggregations._sum.netPaid),
    });
    t.int('feesPaid', {
      resolve: (source, args, context) =>
        context.prisma.eventRegistration
          .aggregate({
            where: {
              event: { id: source.id },
              stripeFee: { not: null },
            },
            _sum: { stripeFee: true },
          })
          .then((aggregations) => aggregations._sum.stripeFee),
    });
    t.nonNull.boolean('userRegistered', {
      description: 'Indicates if the current user is registered for the event',
      resolve: (source, args, context) => {
        if (!context.user) return false;
        return context.prisma.eventRegistration
          .count({
            where: {
              eventId: source.id,
              userId: context.user.id,
              type: RegistrationType.PARTICIPANT,
            },
          })
          .then((number) => number !== 0);
      },
    });
    t.nonNull.boolean('userIsOrganizer', {
      description: 'Indicates if the current user is organizer for the event',
      resolve: (source, args, context) => {
        if (!context.user) return false;
        return context.prisma.eventRegistration
          .count({
            where: {
              eventId: source.id,
              userId: context.user.id,
              type: RegistrationType.ORGANIZER,
            },
          })
          .then((number) => number !== 0);
      },
    });
    t.field('organizers', {
      description: 'Organizers alraedy on this event',
      type: nonNull(list(nonNull(userType))),
      resolve: (source, args, context) =>
        context.prisma.user.findMany({
          where: {
            eventRegistrations: {
              some: {
                eventId: source.id,
                type: RegistrationType.ORGANIZER,
              },
            },
          },
        }),
    });
    t.nonNull.boolean('couldBeOrganizer', {
      description:
        'Indicates whether the user could be an organizer for this event',
      resolve: async (root, args, context) => {
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = await context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: context.user.id,
              tenantId: context.tenant.id,
            },
          },
          select: { status: true },
        });
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
      resolve: async (root, args, context) => {
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Participant signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = await context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: context.user.id,
              tenantId: context.tenant.id,
            },
          },
          select: { status: true },
        });
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
      resolve: async (root, args, context) =>
        context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            type: RegistrationType.PARTICIPANT,
          },
        }),
    });
    t.field({
      name: 'participantRegistrationPossible',
      description:
        'Indicates whether the current user can register to this event as participant',
      type: nonNull(Json),
      resolve: async (root, args, context) => {
        if (!context.user) {
          if (process.env.DEV) {
            console.info(`Can't register participant because user is missing`);
          }
          return { option: false, reason: 'You have to log in to register!' };
        }
        const { status } = await context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: context.user.id,
              tenantId: context.tenant.id,
            },
          },
          select: { status: true },
        });
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
          await context.prisma.eventRegistration.findUnique({
            where: {
              userId_eventId: {
                userId: context.user.id,
                eventId: root.id,
              },
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
              },
              type: RegistrationType.PARTICIPANT,
              user: { id: context.user.id },
            },
          });
        if (
          registrationsOfUser >= 5 &&
          !root.title.includes('ESNcard') &&
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
      resolve: async (root, args, context) =>
        context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            type: RegistrationType.ORGANIZER,
          },
        }),
    });
    t.nonNull.boolean('organizerRegistrationPossible', {
      description:
        'Indicates whether the current user can register to this event as Organizer',
      resolve: async (root, args, context) => {
        if (!context.user) {
          if (process.env.DEV) {
            console.info(
              'Organizer signup not possible because of missing user'
            );
          }
          return false;
        }
        const { status } = await context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: context.user.id,
              tenantId: context.tenant.id,
            },
          },
          select: { status: true },
        });
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
          await context.prisma.eventRegistration.findUnique({
            where: {
              userId_eventId: {
                userId: context.user.id,
                eventId: root.id,
              },
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

export const createEventFromTemplateInput = inputObjectType({
  name: 'CreateEventFromTemplateInput',
  description: 'Additional inputs to create an event from a template',
  definition(t) {
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.field(TumiEvent.price);
    t.field(TumiEvent.registrationLink);
    t.field(TumiEvent.registrationMode);
    t.id('organizerId');
  },
});

export const updateEventInput = inputObjectType({
  name: 'UpdateEventInput',
  description: 'Additional inputs to create an event from a template',
  definition(t) {
    t.field(TumiEvent.title);
    t.field(TumiEvent.icon);
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.description);
    t.field(TumiEvent.organizerText);
    t.field(TumiEvent.participantText);
    t.field(TumiEvent.registrationMode);
    t.field(TumiEvent.registrationLink);
    t.field(TumiEvent.price);
    t.field(TumiEvent.organizerSignup);
    t.field(TumiEvent.participantSignup);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.id('eventOrganizerId');
  },
});

export const getAllEventsQuery = queryField('events', {
  description: 'Get a list of all events',
  type: nonNull(list(nonNull(eventType))),
  args: { after: arg({ type: DateTime }) },
  resolve: async (source, { after }, context) => {
    after ??= new Date();
    if (!context.user) {
      return context.prisma.tumiEvent.findMany({
        orderBy: { start: 'asc' },
        where: {
          participantSignup: {
            has: MembershipStatus.NONE,
          },
          end: { gt: new Date() },
          publicationState: PublicationState.PUBLIC,
        },
      });
    }
    const { role, status } = await context.prisma.usersOfTenants.findUnique({
      where: {
        userId_tenantId: {
          userId: context.user.id,
          tenantId: context.tenant.id,
        },
      },
    });
    if (role === Role.ADMIN) {
      return context.prisma.tumiEvent.findMany({
        orderBy: { start: 'asc' },
        where: { end: { gt: after } },
      });
    }
    return context.prisma.tumiEvent.findMany({
      orderBy: { start: 'asc' },
      where: {
        end: { gt: after },
        OR: [
          {
            participantSignup: {
              has: status,
            },
            publicationState: PublicationState.PUBLIC,
          },
          {
            organizerSignup: { has: status },
            publicationState: {
              in: [PublicationState.PUBLIC, PublicationState.ORGANIZERS],
            },
          },
        ],
      },
    });
  },
});

export const getOneEventQuery = queryField('event', {
  description: 'Get one event by ID',
  type: eventType,
  args: { eventId: nonNull(idArg()) },
  resolve: (source, { eventId }, context) =>
    context.prisma.tumiEvent.findUnique({ where: { id: eventId } }),
});

export const addOrganizerMutation = mutationField('addOrganizerToEvent', {
  description: 'Adds the user with the supplied id to the event',
  args: {
    eventId: nonNull(idArg()),
    userId: nonNull(idArg()),
  },
  type: eventType,
  resolve: (source, { eventId, userId }, context) =>
    context.prisma.tumiEvent.update({
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
    }),
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
    resolve: (source, { id, state }, context) =>
      context.prisma.tumiEvent.update({
        where: { id },
        data: { publicationState: state },
      }),
  }
);

export const removeUserFromEventMutation = mutationField(
  'removeUserFromEvent',
  {
    description: 'Removes the user with the supplied id to the event',
    args: {
      eventId: nonNull(idArg()),
      userId: nonNull(idArg()),
    },
    type: eventType,
    resolve: (source, { userId, eventId }, context) =>
      context.prisma.tumiEvent.update({
        where: { id: eventId },
        data: {
          registrations: {
            delete: { userId_eventId: { eventId, userId } },
          },
        },
      }),
  }
);

export const deregisterFromEventMutation = mutationField(
  'deregisterFromEvent',
  {
    args: { id: nonNull(idArg()) },
    type: eventType,
    resolve: (source, { id }, context) =>
      context.prisma.tumiEvent.update({
        where: { id },
        data: {
          registrations: {
            delete: {
              userId_eventId: { eventId: id, userId: context.user.id },
            },
          },
        },
      }),
  }
);

export const registerForEvent = mutationField('registerForEvent', {
  type: eventType,
  args: {
    registrationType: arg({
      type: registrationTypeEnum,
      default: RegistrationType.PARTICIPANT,
    }),
    eventId: nonNull(idArg()),
  },
  resolve: (source, { registrationType, eventId }, context) =>
    context.prisma.$transaction(async (prisma) => {
      const event = await prisma.tumiEvent.findUnique({
        where: { id: eventId },
      });
      const { status } = await context.prisma.usersOfTenants.findUnique({
        where: {
          userId_tenantId: {
            userId: context.user.id,
            tenantId: context.tenant.id,
          },
        },
        select: { status: true },
      });
      const allowedStatus =
        registrationType === RegistrationType.PARTICIPANT
          ? event.participantSignup
          : event.organizerSignup;
      if (!allowedStatus.includes(status)) {
        throw new ApolloError(
          'User does not fulfill the requirements to sign up!'
        );
      }
      const registeredUsers = await prisma.eventRegistration.count({
        where: { eventId, type: registrationType },
      });
      const maxRegistrations =
        registrationType === RegistrationType.PARTICIPANT
          ? event.participantLimit
          : event.organizerLimit;
      if (registeredUsers >= maxRegistrations) {
        throw new ApolloError('Event does not have an available spot!');
      }
      return context.prisma.tumiEvent.update({
        where: { id: eventId },
        data: {
          registrations: {
            create: { type: registrationType, userId: context.user.id },
          },
        },
      });
    }),
});

export const updateEventMutation = mutationField('updateEventGeneralInfo', {
  type: nonNull(eventType),
  args: {
    id: nonNull(idArg()),
    data: nonNull(updateEventInput),
  },
  resolve: (source, { id, data }, context) =>
    context.prisma.tumiEvent.update({
      where: {
        id,
      },
      data,
    }),
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
          price: createEventFromTemplateInput.price,
          description: template.description,
          locationId: template.locationId,
          location: template.location,
          participantText: template.participantText,
          participantMail: template.participantMail,
          organizerText: template.organizerText,
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
