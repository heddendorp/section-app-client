import {
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { CostItem } from 'nexus-prisma';
import { eventType } from './event';
import { createReceiptInputType } from './receipt';
import { Role } from '@tumi/server-models';
import { ApolloError } from 'apollo-server-express';

export const costItemType = objectType({
  name: CostItem.$name,
  description: CostItem.$description,
  definition(t) {
    t.field(CostItem.id);
    t.field(CostItem.createdAt);
    t.field({
      ...CostItem.event,
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findUnique({ where: { id: source.eventId } }),
    });
    t.field(CostItem.eventId);
    t.field(CostItem.name);
    t.field(CostItem.calculationInfo);
    t.field(CostItem.details);
    t.field(CostItem.amount);
    t.field(CostItem.actualAmount);
    t.field(CostItem.confirmed);
    t.field(CostItem.onInvoice);
    t.field(CostItem.moneySent);
    t.field(CostItem.moneySentTo);
    t.field({
      name: 'submittedAmount',
      type: nonNull('Decimal'),
      resolve: (source, args, context) =>
        context.prisma.receipt
          .aggregate({
            where: { costItem: { id: source.id } },
            _sum: { amount: true },
          })
          .then((data) => data._sum.amount ?? 0),
    });
    t.field({
      ...CostItem.receipts,
      resolve: (source, args, context) =>
        context.prisma.receipt.findMany({
          where: { costItem: { id: source.id } },
        }),
    });
  },
});

export const getCostItemsForEventQuery = queryField('costItemsForEvent', {
  type: nonNull(list(nonNull(costItemType))),
  args: { eventId: nonNull(idArg()) },
  resolve: (source, { eventId }, context) =>
    context.prisma.costItem.findMany({ where: { event: { id: eventId } } }),
});

export const getCostItemQuery = queryField('costItem', {
  type: nonNull(costItemType),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.costItem.findUnique({ where: { id } }),
});

export const getUploadKeyQuery = queryField('blobUploadKey', {
  type: nonNull('String'),
  resolve: () => process.env.BLOB_SAS_TOKEN,
});

export const addReceiptToCostItemMutation = mutationField(
  'addReceiptToCostItem',
  {
    type: costItemType,
    args: {
      costItemId: nonNull(idArg()),
      receiptInput: nonNull(createReceiptInputType),
    },
    resolve: (source, { costItemId, receiptInput }, context) =>
      context.prisma.costItem.update({
        where: { id: costItemId },
        data: {
          receipts: {
            create: {
              ...receiptInput,
              user: { connect: { id: context.user.id } },
            },
          },
        },
      }),
  }
);

export const deleteReceiptMutation = mutationField('deleteReceipt', {
  type: nonNull(costItemType),
  args: { costItemId: nonNull(idArg()), receiptId: nonNull(idArg()) },
  resolve: async (source, { costItemId, receiptId }, context) => {
    const { role } = context.assignment;
    const receipt = await context.prisma.receipt.findUnique({
      where: { id: receiptId },
    });
    if (role !== Role.ADMIN && receipt.userId !== context.user.id) {
      throw new ApolloError(
        'Only Admins can delete receipts not added by them.'
      );
    }
    return context.prisma.costItem.update({
      where: { id: costItemId },
      data: { receipts: { delete: { id: receiptId } } },
    });
  },
});

export const deleteCostItemMutation = mutationField('deleteCostItem', {
  type: eventType,
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.$transaction(async (prisma) => {
      const { role } = context.assignment;
      if (role !== Role.ADMIN) {
        throw new ApolloError('Only Admins can delete cost items');
      }
      const item = await prisma.costItem.delete({ where: { id } });
      return prisma.tumiEvent.findUnique({ where: { id: item.eventId } });
    }),
});
