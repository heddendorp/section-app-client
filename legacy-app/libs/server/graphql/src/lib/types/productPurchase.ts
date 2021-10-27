import { objectType } from 'nexus';
import { ProductPurchase } from 'nexus-prisma';

export const productPurchaseType = objectType({
  name: ProductPurchase.$name,
  definition(t) {
    t.field(ProductPurchase.id);
    t.field(ProductPurchase.createdAt);
    t.field(ProductPurchase.product);
    t.field(ProductPurchase.user);
    t.field(ProductPurchase.price);
    t.field(ProductPurchase.productId);
    t.field(ProductPurchase.userId);
    t.field(ProductPurchase.payment);
    t.field(ProductPurchase.paymentId);
  },
});
