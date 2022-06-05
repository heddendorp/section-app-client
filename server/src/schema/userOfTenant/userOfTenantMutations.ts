import { builder } from '../../builder';
import { MembershipStatus, Role } from '../../generated/prisma';
import prisma from '../../client';

builder.mutationFields((t) => ({
  updateUserRole: t.prismaField({
    type: 'UsersOfTenants',
    args: {
      userId: t.arg.id({ required: true }),
      role: t.arg({ type: Role, required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.usersOfTenants.update({
        where: {
          userId_tenantId: {
            userId: args.userId,
            tenantId: context.tenant.id,
          },
        },
        data: { role: args.role },
      }),
  }),
  updateUserStatus: t.prismaField({
    type: 'UsersOfTenants',
    args: {
      userId: t.arg.id({ required: true }),
      status: t.arg({ type: MembershipStatus, required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.usersOfTenants.update({
        where: {
          userId_tenantId: {
            userId: args.userId,
            tenantId: context.tenant.id,
          },
        },
        data: { status: args.status },
      }),
  }),
}));
