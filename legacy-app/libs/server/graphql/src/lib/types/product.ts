import {
  booleanArg,
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
  PurchaseStatus,
  Role,
} from '@tumi/server-models';
import { CacheScope } from 'apollo-server-types';
import { productImageType } from './productImage';
import { constant, countBy, flatten, times, toPairs } from 'lodash';
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
    t.field(Product.isESNcard);
    t.field(Product.needsShippingAddress);
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
      ...Product.submissionItems,
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.product
          .findUnique({ where: { id: source.id } })
          .submissionItems();
      },
    });
    t.field({
      ...Product.lineItems,
      args: { onlyWithPurchase: booleanArg({ default: false }) },
      resolve: (source, { onlyWithPurchase }, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 10,
          scope: CacheScope.Public,
        });
        return context.prisma.product
          .findUnique({ where: { id: source.id } })
          .lineItems(
            onlyWithPurchase
              ? {
                  where: {
                    purchase: { status: { not: PurchaseStatus.CANCELLED } },
                  },
                }
              : undefined
          );
      },
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
    t.field({
      name: 'defaultPrice',
      type: 'Decimal',
      resolve: (source) => {
        return source.prices.options.find((p) => p.defaultPrice).amount;
      },
    });
    t.field({
      name: 'orderQuantity',
      type: nonNull('Int'),
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 60,
          scope: CacheScope.Public,
        });
        return context.prisma.lineItem
          .aggregate({
            where: {
              purchase: {
                status: {
                  not: PurchaseStatus.CANCELLED,
                },
              },
              productId: source.id,
            },
            _sum: { quantity: true },
          })
          .then((result) => result._sum.quantity ?? 0);
      },
    });
    t.field({
      name: 'uniSplit',
      type: nonNull(list(nonNull('Json'))),
      resolve: (source, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 60,
          scope: CacheScope.Public,
        });
        return context.prisma.lineItem
          .findMany({
            where: {
              purchase: {
                status: {
                  not: PurchaseStatus.CANCELLED,
                },
              },
              productId: source.id,
            },
            include: {
              purchase: {
                include: { user: { select: { university: true } } },
              },
            },
          })
          .then((items) =>
            toPairs(
              countBy(
                flatten(
                  items.map((item) =>
                    times(
                      item.quantity,
                      constant(item.purchase.user.university)
                    )
                  )
                )
              )
            ).map(([uni, count]) => ({ uni, count }))
          );
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
    t.field(Product.needsShippingAddress);
  },
});

export const getProductsQuery = queryField('products', {
  type: nonNull(list(nonNull(productType))),
  args: { onlyWithOrders: booleanArg({ default: false }) },
  resolve: (source, { onlyWithOrders }, context, info) => {
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
    if (onlyWithOrders) {
      where.lineItems = {
        some: {
          purchase: {
            status: { not: PurchaseStatus.CANCELLED },
          },
        },
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

export const updateLeadImageMutation = mutationField('updateLeadImage', {
  type: nonNull(productType),
  args: {
    id: nonNull(idArg()),
    leadImageId: nonNull(idArg()),
  },
  resolve: (source, { id, leadImageId }, context) => {
    return context.prisma.product.update({
      where: { id },
      data: {
        leadImageId,
      },
    });
  },
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
