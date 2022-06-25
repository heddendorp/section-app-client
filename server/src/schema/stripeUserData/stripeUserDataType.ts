import { builder } from '../../builder';

export const stripeUserDataType = builder.prismaObject('StripeUserData', {
  findUnique: (stripeUserData) => ({
    id: stripeUserData.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    paymentMethodId: t.exposeString('paymentMethodId', { nullable: true }),
    customerId: t.exposeString('customerId'),
  }),
});
