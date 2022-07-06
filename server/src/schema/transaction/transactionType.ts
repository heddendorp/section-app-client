import { builder } from '../../builder';

builder.prismaObject('Transaction', {
  findUnique: (transaction) => ({
    id: transaction.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    amount: t.expose('amount', { type: 'Decimal' }),
    comment: t.exposeString('comment', { nullable: true }),
    costItem: t.relation('costItem'),
    costItemId: t.exposeID('costItemId', { nullable: true }),
    createdBy: t.relation('createdBy'),
    creatorId: t.exposeID('creatorId', { nullable: true }),
    eventRegistration: t.relation('eventRegistration', { nullable: true }),
    isMembershipFee: t.exposeBoolean('isMembershipFee'),
    partner: t.exposeString('partner', { nullable: true }),
    purchase: t.relation('purchase'),
    stripePayment: t.relation('stripePayment'),
    subject: t.exposeString('subject'),
    tenant: t.relation('tenant'),
    tenantId: t.exposeID('tenantId'),
    type: t.exposeString('type'),
    user: t.relation('user', { nullable: true }),
    userId: t.exposeID('userId', { nullable: true }),
  }),
});
