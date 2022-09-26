import { builder } from '../../builder';
import { removeEmpty } from '../helperFunctions';
import prisma from '../../client';
import {
  MembershipStatus,
  PublicationState,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
} from '../../generated/prisma';
import { GraphQLError } from 'graphql';
import {
  createEventFromTemplateInput,
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
      anonymousRating: t.arg.boolean({ defaultValue: true }),
    },
    resolve: async (
      query,
      root,
      { id, rating, comment, anonymousRating },
      context
    ) => {
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
        rejectOnNotFound: false,
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
                anonymousRating: anonymousRating ?? true,
                userComment: comment,
              },
            },
          },
        },
      });
    },
  }),
  createEventFromTemplate: t.prismaField({
    authScopes: { member: true },
    type: 'TumiEvent',
    args: {
      input: t.arg({
        type: createEventFromTemplateInput,
        required: true,
      }),
      templateId: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, { input, templateId }, context) => {
      const template = await prisma.eventTemplate.findUnique({
        where: { id: templateId },
      });
      if (!template) {
        throw new GraphQLYogaError(
          'Template with the given ID could not be found'
        );
      }
      return prisma.tumiEvent.create({
        data: {
          title: template.title,
          icon: template.icon,
          start: input.start,
          end: input.end,
          participantLimit: input.participantLimit,
          organizerLimit: input.organizerLimit,
          registrationLink: input.registrationLink,
          registrationMode: input.registrationMode,
          excludeFromStatistics: input.excludeFromStatistics,
          excludeFromRatings: input.excludeFromRatings,
          description: template.description,
          coordinates: template.coordinates ?? undefined,
          location: template.location,
          googlePlaceId: template.googlePlaceId,
          googlePlaceUrl: template.googlePlaceUrl,
          participantText: template.participantText,
          organizerText: template.organizerText,
          insuranceDescription: template.insuranceDescription,
          shouldBeReportedToInsurance: template.shouldBeReportedToInsurance,
          ...(input.registrationMode === RegistrationMode.STRIPE
            ? ({
                prices: {
                  options: [
                    {
                      amount: input.price ?? 5,
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
              } as any)
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
              id: input.eventOrganizerId,
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
      await prisma.eventRegistration.deleteMany({
        where: {
          event: { id: id },
          OR: [
            {
              type: RegistrationType.ORGANIZER,
            },
            {
              status: RegistrationStatus.CANCELLED,
            },
          ],
        },
      });
      await prisma.costItem.deleteMany({ where: { event: { id } } });
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
      const event = await prisma.tumiEvent.findUniqueOrThrow({
        where: { id: eventId },
      });
      const template = await prisma.eventTemplate.findUniqueOrThrow({
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
        onInvoice: boolean;
        notSubsidized: boolean;
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
              calculationInfo = `${allParticipants} × ${item.value}€ per participant`;
              break;
            default:
              amount =
                item.value * Math.ceil(allParticipants / (item.scale ?? 1));
              calculationInfo = `${Math.ceil(
                allParticipants / (item.scale ?? 1)
              )} × ${item.value}€ per ${item.scale ?? 1} participants`;
          }
          return {
            eventId,
            notSubsidized: item.notSubsidized,
            onInvoice: item.onInvoice ?? false,
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
