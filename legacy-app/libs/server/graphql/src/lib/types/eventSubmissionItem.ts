import {
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { EventSubmissionItem } from 'nexus-prisma';
import { Role } from '@tumi/server-models';
import { ApolloError } from 'apollo-server-express';
import { eventSubmissionType } from './eventSubmission';
import { eventType } from './event';

export const eventSubmissionItemType = objectType({
  name: EventSubmissionItem.$name,
  description: EventSubmissionItem.$description,
  definition(t) {
    t.field(EventSubmissionItem.id);
    t.field(EventSubmissionItem.createdAt);
    t.field({
      ...EventSubmissionItem.event,
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findUnique({ where: { id: source.eventId } }),
    });
    t.field(EventSubmissionItem.eventId);
    t.field(EventSubmissionItem.required);
    t.field(EventSubmissionItem.submissionTime);
    t.field(EventSubmissionItem.type);
    t.field(EventSubmissionItem.name);
    t.field(EventSubmissionItem.instruction);
    t.field(EventSubmissionItem.data);
    t.field({
      ...EventSubmissionItem.submissions,
      resolve: (source, args, context) =>
        context.prisma.eventSubmission.findMany({
          where: { submissionItem: { id: source.id } },
        }),
    });
    t.field({
      name: 'ownSubmissions',
      type: nonNull(list(nonNull(eventSubmissionType))),
      resolve: (source, args, context) => {
        return context.prisma.eventSubmissionItem
          .findUnique({
            where: { id: source.id },
          })
          .submissions({
            where: { registration: { user: { id: context.user.id } } },
          });
      },
    });
  },
});

export const createSubmissionItemInputType = inputObjectType({
  name: 'CreateSubmissionItemInput',
  definition(t) {
    t.field(EventSubmissionItem.required);
    t.field(EventSubmissionItem.submissionTime);
    t.field(EventSubmissionItem.type);
    t.field(EventSubmissionItem.name);
    t.field(EventSubmissionItem.instruction);
    t.field(EventSubmissionItem.data);
  },
});

export const createSubmissionItemMutation = mutationField(
  'createSubmissionItem',
  {
    type: nonNull(eventSubmissionItemType),
    args: {
      id: nonNull(idArg({ description: 'ID of the targeted event' })),
      target: stringArg({ default: 'event' }),
      data: nonNull(createSubmissionItemInputType),
    },
    resolve: async (source, { id, data, target }, context) => {
      switch (target) {
        case 'event': {
          const event = await context.prisma.tumiEvent.findUnique({
            where: { id },
          });
          const { role } = context.assignment;
          if (role !== Role.ADMIN && event.creatorId !== context.user.id) {
            throw new ApolloError(
              'Only Admins can update events that they did not create'
            );
          }
          return context.prisma.eventSubmissionItem.create({
            data: {
              ...data,
              event: { connect: { id } },
            },
          });
        }
        case 'product': {
          const { role } = context.assignment;
          if (role !== Role.ADMIN) {
            throw new ApolloError('Only Admins can update products');
          }
          return context.prisma.eventSubmissionItem.create({
            data: {
              ...data,
              product: { connect: { id } },
            },
          });
        }
        default:
          throw new ApolloError('Invalid target');
      }
    },
  }
);

export const removeSubmissionItemMutation = mutationField(
  'deleteSubmissionItem',
  {
    type: nonNull(eventSubmissionItemType),
    args: {
      id: nonNull(idArg({ description: 'ID of the item to delete' })),
    },
    resolve: async (source, { id }, context) => {
      const { role } = context.assignment;
      if (role !== Role.ADMIN) {
        throw new ApolloError('Only Admins can delete submission items');
      }
      return context.prisma.eventSubmissionItem.delete({
        where: { id },
      });
    },
  }
);

export const createSubmissionItemOnEventMutation = mutationField(
  'createSubmissionOnEvent',
  {
    type: nonNull(eventType),
    args: {
      id: nonNull(idArg({ description: 'ID of the targeted event' })),
      data: nonNull(createSubmissionItemInputType),
    },
    resolve: async (source, { id, data }, context) => {
      const event = await context.prisma.tumiEvent.findUnique({
        where: { id },
      });
      const { role } = context.assignment;
      if (role !== Role.ADMIN && event.creatorId !== context.user.id) {
        throw new ApolloError(
          'Only Admins can update events that they did not create'
        );
      }
      return context.prisma.tumiEvent.update({
        where: { id },
        data: { submissionItems: { create: data } },
      });
    },
  }
);
