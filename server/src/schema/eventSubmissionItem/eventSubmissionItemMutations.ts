import { builder } from '../../builder';
import { createSubmissionItemInputType } from './eventSubmissionItemType';
import prisma from '../../client';

builder.mutationFields((t) => ({
  createSubmissionItem: t.prismaField({
    type: 'EventSubmissionItem',
    args: {
      targetId: t.arg.id({ required: true }),
      target: t.arg.string({ defaultValue: 'event' }),
      input: t.arg({ type: createSubmissionItemInputType, required: true }),
    },
    resolve: async (query, root, { input, target, targetId }, context) => {
      switch (target) {
        case 'event':
          return prisma.eventSubmissionItem.create({
            ...query,
            data: { ...input, event: { connect: { id: targetId } } },
          });
        case 'product':
          return prisma.eventSubmissionItem.create({
            ...query,
            data: { ...input, product: { connect: { id: targetId } } },
          });
        default:
          throw new Error('Invalid target');
      }
    },
  }),
  deleteSubmissionItem: t.prismaField({
    type: 'EventSubmissionItem',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { id }, context) => {
      return prisma.eventSubmissionItem.delete({
        ...query,
        where: { id },
      });
    },
  }),
}));
