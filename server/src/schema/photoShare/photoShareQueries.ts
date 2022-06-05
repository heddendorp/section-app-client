import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  photos: t.prismaField({
    type: ['PhotoShare'],
    resolve: async (query, parent, args, context, info) =>
      prisma.photoShare.findMany({
        ...query,
      }),
  }),
}));
