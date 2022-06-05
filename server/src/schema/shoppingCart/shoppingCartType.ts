import { builder } from '../../builder';

export const shoppingCartType = builder.prismaObject('ShoppingCart', {
  findUnique: (shoppingCart) => ({
    id: shoppingCart.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    items: t.relation('items'),
    userOfTenant: t.relation('userOfTenant'),
    usersOfTenantsTenantId: t.exposeID('usersOfTenantsTenantId'),
    usersOfTenantsUserId: t.exposeID('usersOfTenantsUserId'),
  }),
});
