import { builder } from '../../builder';
import { Prisma } from '../../generated/prisma';

export const stripePaymentType = builder.prismaObject('StripePayment', {
  findUnique: (stripePayment) => ({
    id: stripePayment.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    paymentIntent: t.exposeString('paymentIntent', { nullable: true }),
    paymentMethod: t.exposeString('paymentMethod', { nullable: true }),
    paymentMethodType: t.exposeString('paymentMethodType', { nullable: true }),
    status: t.exposeString('status'),
    shipping: t.expose('shipping', { type: 'JSON', nullable: true }),
    events: t.expose('events', { type: 'JSON' }),
    amount: t.expose('amount', { type: 'Decimal' }),
    feeAmount: t.expose('feeAmount', { type: 'Decimal', nullable: true }),
    netAmount: t.expose('netAmount', { type: 'Decimal', nullable: true }),
    refundedAmount: t.expose('refundedAmount', {
      type: 'Decimal',
      nullable: true,
    }),
    netLessRefundAmount: t.field({
      type: 'Decimal',
      resolve: (payment) =>
        new Prisma.Decimal(
          Math.max(
            0,
            (payment.netAmount?.toNumber() ?? 0) -
              (payment.refundedAmount?.toNumber() ?? 0)
          )
        ),
    }),
    transactions: t.relation('transactions'),
    checkoutSession: t.exposeString('checkoutSession'),
  }),
});
