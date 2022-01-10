import {
  arg,
  booleanArg,
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { Purchase } from '../nexus';
import { ApolloError } from 'apollo-server-express';
import * as stripe from 'stripe';
import { DateTime } from 'luxon';
import { CacheScope } from 'apollo-server-types';
import { MembershipStatus } from '@tumi/server-models';
import { purchaseStatusEnum } from './enums';

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

export const purchasesQuery = queryField('purchases', {
  type: nonNull(list(nonNull(purchaseType))),
  args: { limitToOwn: booleanArg({ default: true }) },
  resolve: async (parent, { limitToOwn }, context, info) => {
    info.cacheControl.setCacheHint({
      maxAge: 10,
      scope: CacheScope.Public,
    });
    if (!limitToOwn && context.assignment?.role !== 'ADMIN') {
      throw new ApolloError(
        'You are not allowed to view other users purchases'
      );
    }
    let where = {};
    if (limitToOwn) {
      where = {
        user: {
          id: context.user.id,
        },
      };
    }
    return context.prisma.purchase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },
});

export const lmuPurchasesQuery = queryField('lmuPurchases', {
  type: nonNull(list(nonNull(purchaseType))),
  resolve: async (parent, args, context, info) => {
    info.cacheControl.setCacheHint({
      maxAge: 10,
      scope: CacheScope.Public,
    });
    if (context.assignment?.role !== 'ADMIN') {
      throw new ApolloError('You are not allowed to view these purchases');
    }
    return context.prisma.purchase.findMany({
      where: {
        user: {
          university: 'lmu',
          tenants: {
            some: {
              tenantId: context.tenant.id,
              status: MembershipStatus.NONE,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
});

export const purchaseQuery = queryField('purchase', {
  type: nonNull(purchaseType),
  args: { id: nonNull(idArg()) },
  resolve: async (parent, { id }, context, info) => {
    info.cacheControl.setCacheHint({
      maxAge: 10,
      scope: CacheScope.Public,
    });
    return context.prisma.purchase.findUnique({
      where: {
        id,
      },
    });
  },
});

export const updateAddressMutation = mutationField('updateAddress', {
  type: nonNull(purchaseType),
  args: {
    id: nonNull(idArg()),
    address: nonNull(arg({ type: 'Json' })),
  },
  resolve: async (source, { id, address }, context, info) => {
    const purchase = await context.prisma.purchase.findUnique({
      where: {
        id,
      },
      include: {
        payment: true,
      },
    });
    const oldShipping = purchase.payment
      ?.shipping as unknown as stripe.Stripe.PaymentIntentUpdateParams.Shipping;
    const shipping = { ...oldShipping, ...{ address } };
    try {
      await stripeClient.paymentIntents.update(purchase.payment.paymentIntent, {
        shipping,
      });
    } catch (e) {
      console.error(e);
    }
    return context.prisma.purchase.update({
      where: { id },
      data: {
        payment: {
          update: { shipping },
        },
      },
    });
  },
});

export const updatePurchaseStatusMutation = mutationField(
  'updatePurchaseStatus',
  {
    type: nonNull(purchaseType),
    args: {
      id: nonNull(idArg()),
      status: nonNull(arg({ type: purchaseStatusEnum })),
    },
    resolve: async (source, { id, status }, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Private });
      return context.prisma.purchase.update({
        where: { id },
        data: {
          status,
        },
      });
    },
  }
);

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
      let customerId;
      const userdata = await context.prisma.stripeUserData.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
          },
        },
      });
      if (userdata) {
        customerId = userdata.customerId;
      }
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
          tax_rates: ['txr_1KFJdx4EBOHRwndEtSV4mPKa'],
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
