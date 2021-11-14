import {
  arg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from 'nexus';
import { LineItem } from 'nexus-prisma';

export const lineItemType = objectType({
  name: LineItem.$name,
  definition(t) {
    t.field(LineItem.id);
    t.field(LineItem.createdAt);
    t.field(LineItem.cancellationReason);
    t.field(LineItem.cart);
    t.field(LineItem.cost);
    t.field(LineItem.pickupTime);
    t.field(LineItem.product);
    t.field(LineItem.productId);
    t.field(LineItem.purchase);
    t.field(LineItem.purchaseId);
    t.field(LineItem.quantity);
    t.field(LineItem.shoppingCartId);
    t.field(LineItem.submissions);
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
      console.log(input.submissions);
      console.log(submissionArray);
      console.log({
        cart: { connect: { id: cart.id } },
        product: { connect: { id: input.productId } },
        submissions: { create: submissionArray },
        quantity: input.quantity,
        cost: input.price.amount,
      });
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
