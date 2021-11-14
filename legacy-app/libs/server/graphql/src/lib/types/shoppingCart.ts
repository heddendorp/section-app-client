import { objectType } from 'nexus';
import { ShoppingCart } from 'nexus-prisma';

export const shoppingCartType = objectType({
  name: ShoppingCart.$name,
  definition(t) {
    t.field(ShoppingCart.id);
    t.field(ShoppingCart.createdAt);
    t.field(ShoppingCart.items);
    t.field(ShoppingCart.userOfTenant);
    t.field(ShoppingCart.usersOfTenantsTenantId);
    t.field(ShoppingCart.usersOfTenantsUserId);
  },
});
