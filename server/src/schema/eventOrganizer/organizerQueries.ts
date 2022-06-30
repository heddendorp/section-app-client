import { builder } from '../../builder';
import prisma from '../../client';
import { organizerType } from './organizerType';

builder.queryFields((t) => ({
  eventOrganizers: t.prismaField({
    type: [organizerType],
    resolve: async (query, parent, args, context, info) =>
      prisma.eventOrganizer.findMany({
        ...query,
        where: { tenant: { id: context.tenant.id } },
      }),
  }),
}));
