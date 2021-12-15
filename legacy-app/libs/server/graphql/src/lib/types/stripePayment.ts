import { list, nonNull, objectType } from 'nexus';
import { StripePayment } from '../nexus';
import { CacheScope } from 'apollo-server-types';
import { Json } from 'nexus-prisma/scalars';

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
      type: nonNull(list(Json)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resolve: (payment) => payment.events ?? [],
    });
    t.field(StripePayment.amount);
    t.field(StripePayment.feeAmount);
    t.field(StripePayment.netAmount);
    t.field(StripePayment.refundedAmount);
    t.field({
      ...StripePayment.purchase,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.stripePayment
          .findUnique({ where: { id: source.id } })
          .purchase();
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
