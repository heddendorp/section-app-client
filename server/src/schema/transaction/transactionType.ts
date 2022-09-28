import { builder } from '../../builder';
import {
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../../generated/prisma';

builder.prismaObject('Transaction', {
  findUnique: (transaction) => ({
    id: transaction.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    amount: t.expose('amount', { type: 'Decimal' }),
    comment: t.exposeString('comment', { nullable: true }),
    receipts: t.relation('receipts'),
    createdBy: t.relation('createdBy'),
    creatorId: t.exposeID('creatorId', { nullable: true }),
    eventRegistration: t.relation('eventRegistration', { nullable: true }),
    isMembershipFee: t.exposeBoolean('isMembershipFee'),
    direction: t.expose('direction', { type: TransactionDirection }),
    purchase: t.relation('purchase'),
    stripePayment: t.relation('stripePayment', { nullable: true }),
    subject: t.exposeString('subject'),
    tenant: t.relation('tenant'),
    tenantId: t.exposeID('tenantId'),
    status: t.expose('status', { type: TransactionStatus }),
    type: t.expose('type', { type: TransactionType }),
    user: t.relation('user', { nullable: true }),
    userId: t.exposeID('userId', { nullable: true }),
  }),
});
