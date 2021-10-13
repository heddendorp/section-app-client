import {
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from 'nexus';
import { EventSubmissionItem } from 'nexus-prisma';
import { eventType } from './event';
import { Role } from '@tumi/server-models';
import { ApolloError } from 'apollo-server-express';

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
    t.field({
      ...EventSubmissionItem.submissions,
      resolve: (source, args, context) =>
        context.prisma.eventSubmission.findMany({
          where: { submissionItem: { id: source.id } },
        }),
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
  },
});

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
