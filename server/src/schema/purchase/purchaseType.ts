import { builder } from '../../builder';
import { PurchaseStatus } from '../../generated/prisma';

export const purchaseType = builder.prismaObject('Purchase', {
  findUnique: (purchase) => ({ id: purchase.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    user: t.relation('user'),
    userId: t.exposeID('userId'),
    items: t.relation('items'),
    status: t.expose('status', { type: PurchaseStatus }),
    transactions: t.relation('transactions'),
  }),
});
