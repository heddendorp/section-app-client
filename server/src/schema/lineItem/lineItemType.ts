import { builder } from '../../builder';

export const lineItemType = builder.prismaObject('LineItem', {
  findUnique: (lineItem) => ({ id: lineItem.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    cancellationReason: t.exposeString('cancellationReason', {
      nullable: true,
    }),
    cart: t.relation('cart'),
    cost: t.expose('cost', { type: 'Decimal' }),
    pickupTime: t.expose('pickupTime', { type: 'DateTime', nullable: true }),
    product: t.relation('product'),
    productId: t.exposeID('productId'),
    purchase: t.relation('purchase'),
    purchaseId: t.exposeID('purchaseId', { nullable: true }),
    quantity: t.exposeInt('quantity'),
    shoppingCartId: t.exposeID('shoppingCartId', { nullable: true }),
    submissions: t.relation('submissions'),
  }),
});
