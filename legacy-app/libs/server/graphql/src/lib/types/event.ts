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
import { MembershipStatus, RegistrationType } from '@tumi/server-models';
import { registrationTypeEnum } from './enums';

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
    t.field(TumiEvent.participantText);
    t.field(TumiEvent.participantMail);
    t.field(TumiEvent.organizerText);
    t.field(TumiEvent.participantLimit);
    t.field(TumiEvent.organizerLimit);
    t.field(TumiEvent.organizerSignup);
    t.field(TumiEvent.participantSignup);
    t.field(TumiEvent.publicationState);
    // t.field(TumiEvent.submissionItems);
    t.field(TumiEvent.registrations);
    // t.field(TumiEvent.costItems);
    t.field(TumiEvent.photoShare);
    t.field(TumiEvent.eventTemplate);
    t.field(TumiEvent.eventTemplateId);
    t.int('participantsRegistered', {
      description: 'Number of users registered as participant to this event',
      resolve: async (root, args, context) =>
        context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            type: RegistrationType.PARTICIPANT,
          },
        }),
    });
    t.boolean('participantRegistrationPossible', {
      description:
        'Indicates whether the current user can register to this event as participant',
      resolve: async (root, args, context) => {
        if (!context.user) return false;
        const { status } = await context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: context.user.id,
              tenantId: context.tenant.id,
            },
          },
          select: { status: true },
        });
        if (!root.participantSignup.includes(status)) return false;
        const previousRegistration =
          await context.prisma.eventRegistration.findFirst({
            where: { user: { id: context.user.id } },
          });
        if (!previousRegistration) return false;
        const currentRegistrationNum =
          await context.prisma.eventRegistration.count({
            where: { type: RegistrationType.PARTICIPANT },
          });
        return currentRegistrationNum < root.participantLimit;
      },
    });
    t.int('organizersRegistered', {
      description: 'Number of users registered as organizer to this event',
      resolve: async (root, args, context) =>
        context.prisma.eventRegistration.count({
          where: {
            eventId: root.id,
            type: RegistrationType.ORGANIZER,
          },
        }),
    });
    t.boolean('organizerRegistrationPossible', {
      description:
        'Indicates whether the current user can register to this event as Organizer',
      resolve: async (root, args, context) => {
        if (!context.user) {
          console.info('Organizer signup not possible because of missing user');
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
          console.info(
            'Organizer signup not possible because of missing status ' + status
          );
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
          console.info(
            'Organizer signup not possible because of already registered'
          );
          console.info(previousRegistration);
          return false;
        }
        const currentRegistrationNum =
          await context.prisma.eventRegistration.count({
            where: { type: RegistrationType.ORGANIZER },
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
    t.id('organizerId');
  },
});

export const getAllEventsQuery = queryField('events', {
  description: 'Get a list of all events',
  type: nonNull(list(nonNull(eventType))),
  resolve: (source, args, context) => context.prisma.tumiEvent.findMany(),
});

export const getOneEventQuery = queryField('event', {
  description: 'Get one event by ID',
  type: eventType,
  args: { eventId: nonNull(idArg()) },
  resolve: (source, { eventId }, context) =>
    context.prisma.tumiEvent.findUnique({ where: { id: eventId } }),
});

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
    context.prisma.tumiEvent.update({
      where: { id: eventId },
      data: {
        registrations: {
          create: { type: registrationType, userId: context.user.id },
        },
      },
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
