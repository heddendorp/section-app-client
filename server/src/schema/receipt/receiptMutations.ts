import { builder } from '../../builder';
import { createReceiptInputType, receiptType } from './receiptType';
import prisma from '../../client';

builder.mutationFields((t) => ({
  createReceipt: t.prismaField({
    authScopes: { member: true },
    type: receiptType,
    args: {
      input: t.arg({
        type: createReceiptInputType,
        required: true,
      }),
      costItemId: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.receipt.create({
        ...query,
        data: {
          ...args.input,
          costItemId: args.costItemId,
          userId: context.user?.id ?? '',
        },
      });
    },
  }),
  deleteReceipt: t.prismaField({
    authScopes: { admin: true },
    type: receiptType,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.receipt.delete({
        ...query,
        where: { id: args.id },
      });
    },
  }),
}));
