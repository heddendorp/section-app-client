import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  eventTemplateCategories: t.prismaField({
    authScopes: { member: true },
    type: ['EventTemplateCategory'],
    resolve: async (query, parent, args, context, info) => {
      return prisma.eventTemplateCategory.findMany({
        ...query,
        where: {
          tenant: {
            id: context.tenant.id,
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    },
  }),
}));
