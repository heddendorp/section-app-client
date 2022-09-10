import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  tenants: t.prismaField({
    type: ['Tenant'],
    resolve: async (query, root, args, ctx, info) =>
      prisma.tenant.findMany({ ...query }),
  }),
  currentTenant: t.prismaField({
    type: 'Tenant',
    resolve: async (query, root, args, ctx, info) =>
      prisma.tenant.findUniqueOrThrow({
        ...query,
        where: { id: ctx.tenant.id },
      }),
  }),
}));
