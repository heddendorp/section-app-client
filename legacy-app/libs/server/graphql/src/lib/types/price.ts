import { objectType } from 'nexus';
import { ProductPrice } from 'nexus-prisma';

export const priceType = objectType({
  name: ProductPrice.$name,
  description: ProductPrice.$description,
  definition(t) {
    t.field(ProductPrice.id);
    t.field(ProductPrice.createdAt);
    t.field(ProductPrice.amount);
    t.field(ProductPrice.availability);
    t.field({
      ...ProductPrice.product,
      resolve: (source, args, context) =>
        context.prisma.product.findUnique({ where: { id: source.productId } }),
    });
    t.field(ProductPrice.productId);
  },
});
