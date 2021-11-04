import { objectType } from 'nexus';
import { StripePayment } from 'nexus-prisma';
import { CacheScope } from 'apollo-server-types';

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
    t.field(StripePayment.events);
    t.field(StripePayment.purchaseId);
    t.field(StripePayment.amount);
    t.field(StripePayment.feeAmount);
    t.field(StripePayment.netAmount);
    t.field(StripePayment.refundedAmount);
    t.field({
      ...StripePayment.productPurchase,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.stripePayment
          .findUnique({ where: { id: source.id } })
          .productPurchase();
      },
    });
    t.field({
      ...StripePayment.eventRegistration,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.stripePayment
          .findUnique({ where: { id: source.id } })
          .eventRegistration();
      },
    });
    t.field(StripePayment.checkoutSession);
  },
});
