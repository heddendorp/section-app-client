import { builder } from '../../builder';
import prisma from '../../client';
import {
  PublicationState,
  RegistrationStatus,
  RegistrationType,
} from '../../generated/prisma';
import { GraphQLError } from 'graphql';
import {
  updateCoreEventInputType,
  updateEventLocationInputType,
  updateGeneralEventInputType,
} from './eventType';
import { GraphQLYogaError } from '@graphql-yoga/node';

builder.mutationFields((t) => ({
  rateEvent: t.prismaField({
    type: 'TumiEvent',
    args: {
      id: t.arg.id({ required: true }),
      rating: t.arg.int({ required: true }),
      comment: t.arg.string({ defaultValue: '' }),
    },
    resolve: async (query, root, { id, rating, comment }, context) => {
      const registration = await prisma.eventRegistration.findFirst({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: {
            id,
          },
          user: {
            id: context.user?.id,
          },
        },
      });
      if (!registration) throw new GraphQLError('Registration not found!');
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id,
        },
        data: {
          registrations: {
            update: {
              where: { id: registration.id },
              data: {
                rating,
                userComment: comment,
              },
            },
          },
        },
      });
    },
  }),
  addOrganizerToEvent: t.prismaField({
    authScopes: { member: true },
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      userId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { eventId, userId }, context) => {
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id: eventId,
        },
        data: {
          registrations: {
            create: {
              status: RegistrationStatus.SUCCESSFUL,
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
  }),
  updateEventTemplateConnection: t.prismaField({
    authScopes: { admin: true },
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      templateId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { eventId, templateId }, context) => {
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id: eventId,
        },
        data: {
          eventTemplate: {
            connect: {
              id: templateId,
            },
          },
        },
      });
    },
  }),
  updateEventGeneralInfo: t.prismaField({
    authScopes: { public: true },
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      input: t.arg({ required: true, type: updateGeneralEventInputType }),
    },
    resolve: async (query, root, { eventId, input }, context) => {
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id: eventId,
        },
        data: {
          ...removeEmpty(input),
        },
      });
    },
  }),
  updateEventCoreInfo: t.prismaField({
    authScopes: { public: true },
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      input: t.arg({ required: true, type: updateCoreEventInputType }),
    },
    resolve: async (query, root, { eventId, input }, context) => {
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id: eventId,
        },
        data: {
          ...removeEmpty(input),
        },
      });
    },
  }),
  changeEventPublication: t.prismaField({
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      publicationState: t.arg({ type: PublicationState, required: true }),
    },
    authScopes: (query, args, context, info) => {
      if (
        args.publicationState === PublicationState.DRAFT ||
        args.publicationState === PublicationState.APPROVAL
      ) {
        return { member: true };
      } else {
        return { admin: true };
      }
    },
    resolve: async (query, root, { eventId, publicationState }, context) => {
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id: eventId,
        },
        data: {
          publicationState,
        },
      });
    },
  }),
  updateEventLocation: t.prismaField({
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      input: t.arg({ type: updateEventLocationInputType, required: true }),
    },
    resolve: async (query, root, { eventId, input }, context) => {
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id: eventId,
        },
        data: {
          ...removeEmpty(input),
        },
      });
    },
  }),
  deleteEvent: t.prismaField({
    authScopes: { admin: true },
    type: 'TumiEvent',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { id }, context) => {
      return prisma.tumiEvent.delete({
        ...query,
        where: {
          id,
        },
      });
    },
  }),
  updateCostItemsFromTemplate: t.prismaField({
    authScopes: { admin: true },
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { eventId }, context) => {
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
        throw new GraphQLYogaError('No items found in template finances');
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
              calculationInfo = `
    }${item.value}€ per event`;
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
    },
  }),
}));
