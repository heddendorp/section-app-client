import { builder } from '../../builder';
import prisma from '../../client';
import { Prisma } from '../../generated/prisma';

export const costItemType = builder.prismaObject('CostItem', {
  findUnique: (costItem) => ({ id: costItem.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    event: t.relation('event'),
    eventId: t.exposeID('eventId'),
    name: t.exposeString('name'),
    calculationInfo: t.exposeString('calculationInfo'),
    details: t.exposeString('details', { nullable: true }),
    amount: t.expose('amount', { type: 'Decimal' }),
    actualAmount: t.expose('actualAmount', { type: 'Decimal', nullable: true }),
    complete: t.exposeBoolean('complete'),
    onInvoice: t.exposeBoolean('onInvoice'),
    notSubsidized: t.exposeBoolean('notSubsidized'),
    receipts: t.relation('receipts'),
    submittedAmount: t.field({
      type: 'Decimal',
      resolve: async (source, args, context) => {
        return prisma.receipt
          .aggregate({
            where: { costItem: { id: source.id } },
            _sum: { amount: true },
          })
          .then((data) => data._sum.amount ?? new Prisma.Decimal(0));
      },
    }),
  }),
});
