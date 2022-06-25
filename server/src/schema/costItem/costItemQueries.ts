import { builder } from '../../builder';
import { costItemType } from './costItemType';
import prisma from '../../client';

builder.queryFields((t) => ({
  costItems: t.prismaField({
    authScopes: { member: true },
    type: [costItemType],
    args: {
      eventId: t.arg.id(),
    },
    resolve: (query, parent, args, context, info) => {
      return prisma.costItem.findMany({
        ...query,
        where: {
          event: {
            id: args.eventId ?? undefined,
          },
        },
      });
    },
  }),
  costItem: t.prismaField({
    authScopes: { member: true },
    type: costItemType,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.costItem.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
  blobUploadKey: t.string({
    authScopes: { member: true },
    // TODO: this should be generated on the fly
    resolve: () => process.env['BLOB_SAS_TOKEN'] ?? '',
  }),
}));
