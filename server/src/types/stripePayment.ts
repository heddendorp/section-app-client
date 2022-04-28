import { list, nonNull, objectType } from 'nexus';
import { StripePayment } from '../generated/nexus-prisma';

export const stripePaymentType = objectType({
  name: StripePayment.$name,
  description: StripePayment.$description,
  definition(t) {
    t.field(StripePayment.id);
    t.field(StripePayment.createdAt);
    t.field(StripePayment.paymentIntent);
    t.field(StripePayment.paymentMethod);
    t.field(StripePayment.paymentMethodType);
    t.field(StripePayment.status);
    t.field(StripePayment.shipping);
    t.field({
      ...StripePayment.events,
      type: nonNull(list('Json')),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resolve: (payment) => payment.events ?? [],
    });
    t.field(StripePayment.amount);
    t.field(StripePayment.feeAmount);
    t.field(StripePayment.netAmount);
    t.field(StripePayment.refundedAmount);
    t.nonNull.decimal('netLessRefundAmount', {
      resolve: (payment) =>
        Math.max(0, (payment.netAmount ?? 0) - (payment.refundedAmount ?? 0)),
    });
    t.field(StripePayment.transaction);
    t.field(StripePayment.transactionId);
    t.field(StripePayment.checkoutSession);
  },
});
