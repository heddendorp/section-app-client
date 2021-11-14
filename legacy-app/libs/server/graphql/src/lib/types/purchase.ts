import { mutationField, nonNull, objectType } from 'nexus';
import { Purchase } from 'nexus-prisma';
import { ApolloError } from 'apollo-server-express';
import * as stripe from 'stripe';
import { DateTime } from 'luxon';
import { CacheScope } from 'apollo-server-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripeClient: stripe.Stripe = require('stripe')(process.env.STRIPE_KEY);

export const purchaseType = objectType({
  name: Purchase.$name,
  definition(t) {
    t.field(Purchase.id);
    t.field(Purchase.createdAt);
    t.field({
      ...Purchase.items,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.purchase
          .findUnique({ where: { id: source.id } })
          .items();
      },
    });
    t.field({
      ...Purchase.user,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.purchase
          .findUnique({ where: { id: source.id } })
          .user();
      },
    });
    t.field(Purchase.status);
    // t.field(Purchase.productId);
    t.field(Purchase.userId);
    t.field({
      ...Purchase.payment,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.purchase
          .findUnique({ where: { id: source.id } })
          .payment();
      },
    });
    t.field(Purchase.paymentId);
  },
});

export const createPurchaseFromCartMutation = mutationField(
  'createPurchaseFromCart',
  {
    type: nonNull(purchaseType),
    resolve: async (source, args, context) => {
      const cart = await context.prisma.shoppingCart.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
          },
        },
        include: { items: { include: { product: true } } },
      });
      if (!cart) {
        throw new ApolloError('Cart not found for current User');
      }
      let { customerId } = await context.prisma.stripeUserData.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
          },
        },
      });
      if (!customerId) {
        const customer = await stripeClient.customers.create({
          name: `${context.user.firstName} ${context.user.lastName}`,
          email: context.user.email,
          metadata: { userId: context.user.id, tenantId: context.tenant.id },
        });
        customerId = customer.id;
        await context.prisma.stripeUserData.create({
          data: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
            customerId: customer.id,
          },
        });
      }
      const baseUrl = process.env.DEV
        ? `http://localhost:4200/basket`
        : `https://tumi.esn.world/events`;
      const checkoutSession = await stripeClient.checkout.sessions.create({
        mode: 'payment',
        customer: customerId,
        line_items: cart.items.map((item) => ({
          amount: item.cost.toNumber() * 100,
          quantity: item.quantity,
          name: item.product.title,
          currency: 'EUR',
        })),
        payment_method_types: [
          'card',
          // 'sofort',
          'giropay',
          'ideal',
          'p24',
          'bancontact',
        ],
        payment_intent_data: {
          description: `Purchase in the TUMi shop`,
        },
        submit_type: 'pay',
        shipping_address_collection: { allowed_countries: ['DE'] },
        cancel_url: `${baseUrl}?cancel=true`,
        success_url: `${baseUrl}?success=true`,
        expires_at: Math.round(DateTime.now().plus({ hours: 5 }).toSeconds()),
      });
      const payment = await context.prisma.stripePayment.create({
        data: {
          user: { connect: { id: context.user.id } },
          amount: checkoutSession.amount_total,
          paymentIntent:
            typeof checkoutSession.payment_intent === 'string'
              ? checkoutSession.payment_intent
              : checkoutSession.payment_intent.id,
          checkoutSession: checkoutSession.id,
          status: 'incomplete',
          events: [
            {
              type: 'payment_intent.created',
              name: 'created',
              date: Date.now(),
            },
          ],
        },
      });
      await context.prisma.shoppingCart.update({
        where: { id: cart.id },
        data: {
          items: {
            disconnect: cart.items.map((item) => ({ id: item.id })),
          },
        },
      });
      return context.prisma.purchase.create({
        data: {
          user: { connect: { id: context.user.id } },
          items: {
            connect: cart.items.map((item) => ({ id: item.id })),
          },
          payment: { connect: { id: payment.id } },
        },
      });
    },
  }
);
