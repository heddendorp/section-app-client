import { builder } from '../../builder';
import { MembershipStatus, Role } from '../../generated/prisma';

builder.prismaObject('UsersOfTenants', {
  findUnique: (userOfTenant) => ({
    userId_tenantId: {
      userId: userOfTenant.userId,
      tenantId: userOfTenant.tenantId,
    },
  }),
  fields: (t) => ({
    user: t.relation('user'),
    tenant: t.relation('tenant'),
    status: t.field({
      type: MembershipStatus,
      resolve: (userOfTenant) => userOfTenant.status,
    }),
    role: t.field({ type: Role, resolve: (userOfTenant) => userOfTenant.role }),
  }),
});
