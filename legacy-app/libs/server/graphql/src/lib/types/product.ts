import {
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { Product } from 'nexus-prisma';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  Role,
} from '@tumi/server-models';
import { CacheScope } from 'apollo-server-types';
import { productImageType } from './productImage';
import ProductWhereInput = Prisma.ProductWhereInput;

export const productType = objectType({
  name: Product.$name,
  description: Product.$description,
  definition(t) {
    t.field(Product.id);
    t.field(Product.createdAt);
    t.field(Product.title);
    t.field(Product.description);
    t.field(Product.availability);
    t.field(Product.prices);
    t.field(Product.publicationState);
    t.field(Product.leadImageId);
    t.field({
      ...Product.images,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.product
          .findUnique({ where: { id: source.id } })
          .images();
      },
    });
    t.field(Product.tenantId);
    t.field({
      ...Product.tenant,
      resolve: (source, args, context) =>
        context.prisma.tenant.findUnique({ where: { id: source.tenantId } }),
    });
    t.field({
      name: 'leadImage',
      type: productImageType,
      resolve: (source, args, context) => {
        if (source.leadImageId === null) return null;
        return context.prisma.productImage.findUnique({
          where: { id: source.leadImageId },
        });
      },
    });
  },
});

export const updateProductInputType = inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.field(Product.title);
    t.field(Product.description);
    t.field(Product.availability);
    t.field(Product.prices);
    t.field(Product.publicationState);
  },
});

export const getProductsQuery = queryField('products', {
  type: nonNull(list(nonNull(productType))),
  resolve: (source, args, context, info) => {
    info.cacheControl.setCacheHint({ scope: CacheScope.Private, maxAge: 10 });
    let where: ProductWhereInput;
    const { role, status } = context.assignment ?? {};
    if (!context.user) {
      where = {
        availability: {
          has: MembershipStatus.NONE,
        },
        publicationState: PublicationState.PUBLIC,
      };
    } else if (role === Role.ADMIN) {
      where = {};
    } else {
      where = {
        availability: {
          has: status,
        },
        publicationState: PublicationState.PUBLIC,
      };
    }
    return context.prisma.product.findMany({
      orderBy: { title: 'asc' },
      where,
    });
  },
});

export const getProductQuery = queryField('product', {
  type: nonNull(productType),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.product.findUnique({
      where: {
        id,
      },
    }),
});

export const newProductMutation = mutationField('createProduct', {
  type: nonNull(productType),
  resolve: (source, args, context) =>
    context.prisma.product.create({
      data: {
        title: 'New Product',
        description: '## Description',
        prices: {
          options: [
            {
              amount: 10,
              defaultPrice: true,
              esnCardRequired: false,
              allowedStatusList: [
                MembershipStatus.NONE,
                MembershipStatus.TRIAL,
                MembershipStatus.FULL,
                MembershipStatus.SPONSOR,
                MembershipStatus.ALUMNI,
              ],
            },
          ],
        },
        availability: [
          MembershipStatus.NONE,
          MembershipStatus.TRIAL,
          MembershipStatus.FULL,
          MembershipStatus.ALUMNI,
          MembershipStatus.SPONSOR,
        ],
        tenant: { connect: { id: context.tenant.id } },
      },
    }),
});

export const updateProductMutation = mutationField('updateProduct', {
  type: nonNull(productType),
  args: {
    id: nonNull(idArg()),
    data: nonNull(updateProductInputType),
  },
  resolve: (source, { id, data }, context) =>
    context.prisma.product.update({
      where: { id },
      data,
    }),
});
