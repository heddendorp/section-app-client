import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  eventOrganizers: t.prismaField({
    type: ['EventOrganizer'],
    resolve: async (query, parent, args, context, info) =>
      prisma.eventOrganizer.findMany({ ...query }),
  }),
}));
