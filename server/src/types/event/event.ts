import {
  arg,
  idArg,
  inputObjectType,
  intArg,
  list,
  mutationField,
  nonNull,
  queryField,
} from 'nexus';
import { TumiEvent } from '../../generated/nexus-prisma';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  RegistrationMode,
  RegistrationType,
  Role,
} from '../../generated/prisma';
import { publicationStateEnum } from '../enums';
import { updateLocationInputType } from '../eventTemplate';
import { EnvelopError } from '@envelop/core';
import { eventType } from './eventType';
import TumiEventWhereInput = Prisma.TumiEventWhereInput;

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
          where: { id: event?.eventTemplateId },
        });
        if (
          typeof template?.finances !== 'object' ||
          Array.isArray(template.finances) ||
          !Array.isArray(template.finances?.items)
        ) {
          throw new EnvelopError('No items found in template finances');
        }
        await prisma.costItem.deleteMany({ where: { event: { id: eventId } } });
        const items = template.finances?.items as {
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
              (event?.participantLimit ?? 0) + (event?.organizerLimit ?? 0);
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
    t.field(TumiEvent.eventOrganizerId);
  },
});

export const getAllEventsQuery = queryField('events', {
  description: 'Get a list of all events',
  type: nonNull(list(nonNull(eventType))),
  args: { after: arg({ type: 'DateTime' }), userId: idArg(), limit: intArg() },
  resolve: async (source, { after, userId, limit }, context) => {
    // cacheControl.setCacheHint({ scope: CacheScope.Private, maxAge: 10 });
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
      ...(limit ? { take: limit } : {}),
      where,
    });
  },
});

export const getOneEventQuery = queryField('event', {
  description: 'Get one event by ID',
  type: nonNull(eventType),
  args: { eventId: nonNull(idArg()) },
  resolve: (source, { eventId }, context) => {
    // cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
    return context.prisma.tumiEvent
      .findUnique({ where: { id: eventId } })
      .then((res) => {
        if (!res) {
          throw new Error('Event not found');
        }
        return res;
      });
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
      const { role } = context.assignment ?? {};
      if (role !== Role.ADMIN && context.user?.id !== event?.creatorId) {
        throw new EnvelopError(
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
    const { role } = context.assignment ?? {};
    if (role !== Role.ADMIN && context.user?.id !== event?.creatorId) {
      throw new EnvelopError(
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
      const { role } = context.assignment ?? {};
      if (
        (state === PublicationState.PUBLIC ||
          state === PublicationState.ORGANIZERS) &&
        role !== Role.ADMIN
      ) {
        throw new EnvelopError('Only admins can publish events!');
      }
      if (role !== Role.ADMIN && context.user?.id !== event?.creatorId) {
        throw new EnvelopError(
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
      const { role } = context.assignment ?? {};
      if (role !== Role.ADMIN && event?.creatorId !== context.user?.id) {
        throw new EnvelopError(
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
    const { role } = context.assignment ?? {};
    if (role !== Role.ADMIN && event?.creatorId !== context.user?.id) {
      throw new EnvelopError(
        'Only Admins can update events that are not their own'
      );
    }
    if (
      event?.publicationState !== PublicationState.DRAFT &&
      role !== Role.ADMIN
    ) {
      throw new EnvelopError('Only admins can edit published Events');
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
        throw new EnvelopError('Template with the given ID could not be found');
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
          coordinates: template.coordinates ?? undefined,
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
          createdBy: { connect: { id: context.user?.id } },
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
