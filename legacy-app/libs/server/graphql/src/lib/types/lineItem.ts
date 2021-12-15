import {
  arg,
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from 'nexus';
import { LineItem } from '../nexus';
import { CacheScope } from 'apollo-server-types';

export const lineItemType = objectType({
  name: LineItem.$name,
  definition(t) {
    t.field(LineItem.id);
    t.field(LineItem.createdAt);
    t.field(LineItem.cancellationReason);
    t.field({
      ...LineItem.cart,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Private,
        });
        if (!source.shoppingCartId) return null;
        return context.prisma.shoppingCart.findUnique({
          where: { id: source.shoppingCartId },
        });
      },
    });
    t.field(LineItem.cost);
    t.field(LineItem.pickupTime);
    t.field({
      ...LineItem.product,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 60,
          scope: CacheScope.Public,
        });
        return context.prisma.product.findUnique({
          where: {
            id: source.productId,
          },
        });
      },
    });
    t.field(LineItem.productId);
    t.field(LineItem.purchase);
    t.field(LineItem.purchaseId);
    t.field(LineItem.quantity);
    t.field(LineItem.shoppingCartId);
    t.field({
      ...LineItem.submissions,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 60,
          scope: CacheScope.Public,
        });
        return context.prisma.lineItem
          .findUnique({
            where: {
              id: source.id,
            },
          })
          .submissions();
      },
    });
  },
});

export const addLineItemToBasketInputType = inputObjectType({
  name: 'AddLineItemToBasketInput',
  definition(t) {
    t.field({ type: nonNull('Json'), name: 'price' });
    t.field({ type: 'Json', name: 'submissions' });
    t.nonNull.string('productId');
    t.int('quantity', { default: 1 });
  },
});

// increase quantity of line item
export const increaseLineItemQuantityMutation = mutationField(
  'increaseLineItemQuantity',
  {
    type: lineItemType,
    args: {
      id: nonNull(idArg()),
    },
    resolve: async (parent, { id }, context) => {
      return context.prisma.lineItem.update({
        where: {
          id,
        },
        data: {
          quantity: { increment: 1 },
        },
      });
    },
  }
);

// Decrease quantity of line item
export const decreaseLineItemQuantityMutation = mutationField(
  'decreaseLineItemQuantity',
  {
    type: lineItemType,
    args: {
      id: nonNull(idArg()),
    },
    resolve: async (parent, { id }, context) => {
      return context.prisma.lineItem.update({
        where: {
          id,
        },
        data: {
          quantity: { decrement: 1 },
        },
      });
    },
  }
);

// Remove line item
export const removeLineItemMutation = mutationField('deleteLineItem', {
  type: lineItemType,
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (parent, { id }, context) => {
    return context.prisma.lineItem.delete({
      where: {
        id,
      },
    });
  },
});

export const addLineItemToBasketMutation = mutationField(
  'addLineItemToBasket',
  {
    type: lineItemType,
    args: {
      input: arg({ type: nonNull(addLineItemToBasketInputType) }),
    },
    resolve: async (source, { input }, context) => {
      let cart = await context.prisma.shoppingCart.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsUserId: context.user.id,
            usersOfTenantsTenantId: context.tenant.id,
          },
        },
      });
      if (!cart) {
        cart = await context.prisma.shoppingCart.create({
          data: {
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
      const submissionArray = [];
      if (input.submissions) {
        Object.entries(input.submissions).forEach(([key, value]) => {
          submissionArray.push({
            submissionItem: { connect: { id: key } },
            data: { value },
          });
        });
      }
      return context.prisma.lineItem.create({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: input.productId } },
          submissions: { create: submissionArray },
          quantity: input.quantity,
          cost: input.price.amount,
        },
      });
    },
  }
);
