import { objectType } from 'nexus';
import { StripePayment } from 'nexus-prisma';

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
    t.field(StripePayment.registrationId);
    t.field(StripePayment.purchaseId);
    t.field(StripePayment.amount);
    t.field(StripePayment.feeAmount);
    t.field(StripePayment.netAmount);
    t.field(StripePayment.refundedAmount);
    t.field(StripePayment.productPurchase);
    t.field(StripePayment.eventRegistration);
  },
});
