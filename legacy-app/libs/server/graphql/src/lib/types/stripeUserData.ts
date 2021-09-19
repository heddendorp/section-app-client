import { nonNull, objectType, queryField } from 'nexus';
import { StripeUserData } from 'nexus-prisma';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_KEY);

export const stripeUserDataType = objectType({
  name: StripeUserData.$name,
  description: StripeUserData.$description,
  definition(t) {
    t.field(StripeUserData.id);
    t.field(StripeUserData.paymentMethodId);
    t.field(StripeUserData.customerId);
  },
});

export const paymentSetupSessionType = objectType({
  name: 'paymentSetupSession',
  definition(t) {
    t.nonNull.string('id');
  },
});

export const getPaymentSetupSessionQuery = queryField(
  'getPaymentSetupSession',
  {
    type: nonNull(paymentSetupSessionType),
    resolve: async (source, args, context) => {
      let stripeData = await context.prisma.stripeUserData.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
          },
        },
      });
      if (!stripeData) {
        const customer = await stripe.customers.create({
          email: context.user.email,
          name: `${context.user.firstName} ${context.user.lastName}`,
          metadata: { userId: context.user.id },
        });
        console.log(customer);
        stripeData = await context.prisma.stripeUserData.create({
          data: {
            customerId: customer.id,
            userOfTenant: {
              connect: {
                userId_tenantId: {
                  userId: context.user.id,
                  tenantId: context.tenant.id,
                },
              },
            },
          },
        });
      }
      const baseURL = process.env.DEV
        ? 'http://localhost:4200/'
        : 'https://tumi.esn.world/';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit'],
        mode: 'setup',
        customer: stripeData.customerId,
        client_reference_id: stripeData.id,
        success_url: `${baseURL}profile?stripe=success`,
        cancel_url: `${baseURL}profile?stripe=fail`,
      });
      console.log(session);
      return session;
    },
  }
);
