import { objectType } from 'nexus';
import { ShoppingCart } from 'nexus-prisma';
import { CacheScope } from 'apollo-server-types';

export const shoppingCartType = objectType({
  name: ShoppingCart.$name,
  definition(t) {
    t.field(ShoppingCart.id);
    t.field(ShoppingCart.createdAt);
    t.field({
      ...ShoppingCart.items,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Private,
        });
        return context.prisma.shoppingCart
          .findUnique({
            where: {
              id: source.id,
            },
          })
          .items();
      },
    });
    t.field(ShoppingCart.userOfTenant);
    t.field(ShoppingCart.usersOfTenantsTenantId);
    t.field(ShoppingCart.usersOfTenantsUserId);
  },
});
