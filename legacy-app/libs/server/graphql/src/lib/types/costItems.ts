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

export const deleteCostItemMutation = mutationField('deleteCostItem', {
  type: eventType,
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.$transaction(async (prisma) => {
      const item = await prisma.costItem.delete({ where: { id } });
      return prisma.tumiEvent.findUnique({ where: { id: item.eventId } });
    }),
});
