import {
  booleanArg,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { EventSubmissionItem } from '../generated/nexus-prisma';
import { PurchaseStatus, Role } from '../generated/prisma';
import { eventSubmissionType } from './eventSubmission';
import { eventType } from './event';
import { countBy, toPairs } from 'lodash';
import { EnvelopError } from '@envelop/core';
import { GraphQLError } from 'graphql';

export const eventSubmissionItemType = objectType({
  name: EventSubmissionItem.$name,
  description: EventSubmissionItem.$description,
  definition(t) {
    t.field(EventSubmissionItem.id);
    t.field(EventSubmissionItem.createdAt);
    t.field(EventSubmissionItem.event);
    t.field(EventSubmissionItem.eventId);
    t.field(EventSubmissionItem.required);
    t.field(EventSubmissionItem.submissionTime);
    t.field(EventSubmissionItem.type);
    t.field(EventSubmissionItem.name);
    t.field(EventSubmissionItem.instruction);
    t.field(EventSubmissionItem.data);
    t.field(EventSubmissionItem.submissions);
    t.field({
      name: 'ownSubmissions',
      type: nonNull(list(nonNull(eventSubmissionType))),
      resolve: (source, args, context) => {
        return context.prisma.eventSubmissionItem
          .findUnique({
            where: { id: source.id },
          })
          .submissions({
            where: { registration: { user: { id: context.user?.id } } },
          });
      },
    });
    t.field({
      name: 'responses',
      type: nonNull(list(nonNull('Json'))),
      args: { onlyWithPurchase: booleanArg({ default: false }) },
      resolve: (source, { onlyWithPurchase }, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 60,
        //   scope: CacheScope.Public,
        // });
        return context.prisma.eventSubmission
          .findMany({
            where: {
              submissionItemId: source.id,
              ...(onlyWithPurchase
                ? {
                    lineItem: {
                      purchase: { status: { not: PurchaseStatus.CANCELLED } },
                    },
                  }
                : {}),
            },
          })
          .then((submissions) =>
            toPairs(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              countBy(submissions.map((submission) => submission.data.value))
            ).map(([value, count]) => ({ value, count }))
          );
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
          const { role } = context.assignment ?? {};
          if (role !== Role.ADMIN && event?.creatorId !== context.user?.id) {
            throw new EnvelopError(
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
          const { role } = context.assignment ?? {};
          if (role !== Role.ADMIN) {
            throw new EnvelopError('Only Admins can update products');
          }
          return context.prisma.eventSubmissionItem.create({
            data: {
              ...data,
              product: { connect: { id } },
            },
          });
        }
        default:
          throw new EnvelopError('Invalid target');
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
      const { role } = context.assignment ?? {};
      if (role !== Role.ADMIN) {
        throw new EnvelopError('Only Admins can delete submission items');
      }
      return context.prisma.eventSubmissionItem.delete({
        where: { id },
      });
    },
  }
);

export const removeSubmissionItemFromEventMutation = mutationField(
  'removeSubmissionFromEvent',
  {
    type: nonNull(eventType),
    args: {
      id: nonNull(idArg({ description: 'ID of the item to delete' })),
    },
    resolve: async (source, { id }, context) => {
      const { role } = context.assignment ?? {};
      if (role !== Role.ADMIN) {
        throw new GraphQLError('Only Admins can delete submission items');
      }
      const event = await context.prisma.tumiEvent.findFirst({
        where: {
          submissionItems: {
            some: { id },
          },
        },
        select: { id: true },
      });
      if (!event) {
        throw new GraphQLError('No event found');
      }
      return context.prisma.tumiEvent.update({
        where: event,
        data: {
          submissionItems: {
            delete: { id },
          },
        },
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
      const { role } = context.assignment ?? {};
      if (role !== Role.ADMIN && event?.creatorId !== context.user?.id) {
        throw new EnvelopError(
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
