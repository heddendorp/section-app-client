import { builder } from '../../builder';
import prisma from '../../client';
import {
  MembershipStatus,
  PublicationState,
  PurchaseStatus,
} from '../../generated/prisma';

export const productType = builder.prismaObject('Product', {
  findUnique: (product) => ({
    id: product.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    title: t.exposeString('title'),
    description: t.exposeString('description'),
    availability: t.expose('availability', { type: [MembershipStatus] }),
    prices: t.expose('prices', { type: 'JSON' }),
    publicationState: t.expose('publicationState', { type: PublicationState }),
    isESNcard: t.exposeBoolean('isESNcard'),
    needsShippingAddress: t.exposeBoolean('needsShippingAddress'),
    isActive: t.exposeBoolean('isActive'),
    leadImageId: t.exposeID('leadImageId', { nullable: true }),
    leadImage: t.prismaField({
      type: 'ProductImage',
      resolve: async (query, parent, args, context, info) => {
        return prisma.productImage.findUniqueOrThrow({
          ...query,
          where: {
            id: parent.leadImageId ?? '',
          },
        });
      },
    }),
    images: t.relation('images'),
    tenantId: t.exposeID('tenantId'),
    tenant: t.relation('tenant'),
    lineItems: t.relation('lineItems', {
      args: { onlyWithPurchase: t.arg.boolean({ defaultValue: false }) },
      query: (args, context) => ({
        ...(args.onlyWithPurchase
          ? {
              where: {
                purchase: { status: { not: PurchaseStatus.CANCELLED } },
              },
            }
          : {}),
      }),
    }),
    //  TODO: add remaining fields
  }),
});
