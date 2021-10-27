import {
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { Product } from 'nexus-prisma';

export const productType = objectType({
  name: Product.$name,
  description: Product.$description,
  definition(t) {
    t.field(Product.id);
    t.field(Product.createdAt);
    t.field(Product.title);
    t.field(Product.icon);
    t.field(Product.description);
    t.field(Product.availability);
    t.field(Product.prices);
    t.field(Product.tenantId);
    t.field({
      ...Product.tenant,
      resolve: (source, args, context) =>
        context.prisma.tenant.findUnique({ where: { id: source.tenantId } }),
    });
  },
});

export const newProductInputType = inputObjectType({
  name: 'newProductInput',
  definition(t) {
    t.field(Product.title);
    t.field(Product.icon);
    t.field(Product.description);
    t.field(Product.availability);
    t.field(Product.prices);
  },
});

export const getProductsQuery = queryField('products', {
  type: nonNull(list(nonNull(productType))),
  resolve: (source, args, context) =>
    context.prisma.product.findMany({
      where: { tenant: { id: context.tenant.id } },
    }),
});

export const newProductMutation = mutationField('newProduct', {
  type: nonNull(productType),
  args: { input: nonNull(newProductInputType) },
  resolve: (source, { input }, context) =>
    context.prisma.product.create({
      data: { ...input, tenant: { connect: { id: context.tenant.id } } },
    }),
});
