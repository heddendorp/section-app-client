import { builder } from '../../builder';
import {
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../../generated/prisma';
import prisma from '../../client';

builder.mutationFields((t) => ({
  createTransaction: t.prismaField({
    type: 'Transaction',
    args: {
      createTransactionInput: t.arg({
        type: createTransactionInputType,
        required: true,
      }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.transaction.create({
        ...query,
        data: {
          subject: args.createTransactionInput.subject,
          amount: args.createTransactionInput.amount,
          comment: args.createTransactionInput.comment,
          direction: args.createTransactionInput.direction,
          status: args.createTransactionInput.status,
          type: args.createTransactionInput.type,
          ...(args.createTransactionInput.userId
            ? { user: { connect: { id: args.createTransactionInput.userId } } }
            : {}),
          tenant: {
            connect: {
              id: context.tenant.id,
            },
          },
          createdBy: {
            connect: {
              id: context.user?.id ?? '',
            },
          },
        },
      }),
  }),
}));

const createTransactionInputType = builder.inputType('CreateTransactionInput', {
  fields: (t) => ({
    amount: t.float({ required: true }),
    subject: t.string({ required: true }),
    direction: t.field({ type: TransactionDirection, required: true }),
    status: t.field({
      type: TransactionStatus,
      defaultValue: TransactionStatus.CONFIRMED,
      required: true,
    }),
    type: t.field({ type: TransactionType, required: true }),
    comment: t.string(),
    userId: t.string(),
  }),
});
