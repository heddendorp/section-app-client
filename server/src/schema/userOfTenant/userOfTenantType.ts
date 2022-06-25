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
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    user: t.relation('user'),
    userId: t.exposeID('userId'),
    tenant: t.relation('tenant'),
    tenantId: t.exposeID('tenantId'),
    status: t.expose('status', { type: MembershipStatus }),
    role: t.expose('role', { type: Role }),
    stripeData: t.relation('stripeData', { nullable: true }),
    cart: t.relation('cart'),
  }),
});
