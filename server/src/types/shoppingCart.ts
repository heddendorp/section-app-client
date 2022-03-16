import { objectType } from 'nexus';
import { ShoppingCart } from '../generated/nexus-prisma';

export const shoppingCartType = objectType({
  name: ShoppingCart.$name,
  definition(t) {
    t.field(ShoppingCart.id);
    t.field(ShoppingCart.createdAt);
    t.field({
      ...ShoppingCart.items,
      resolve: (source, args, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 10,
        //   scope: CacheScope.Private,
        // });
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
