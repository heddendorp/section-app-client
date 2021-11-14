import { objectType } from 'nexus';
import { Purchase } from 'nexus-prisma';

export const purchaseType = objectType({
  name: Purchase.$name,
  definition(t) {
    t.field(Purchase.id);
    t.field(Purchase.createdAt);
    t.field(Purchase.items);
    t.field(Purchase.user);
    t.field(Purchase.status);
    // t.field(Purchase.productId);
    t.field(Purchase.userId);
    t.field(Purchase.payment);
    t.field(Purchase.paymentId);
  },
});
