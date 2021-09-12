import { Tenant } from 'nexus-prisma';
import { extendType, objectType, queryField } from 'nexus';

export const tenantType = objectType({
  name: Tenant.$name,
  description: Tenant.$description,
  definition(t) {
    t.field(Tenant.id);
    t.field(Tenant.name);
    t.field(Tenant.createdAt);
    t.field(Tenant.shortName);
  },
});

export const tenantQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('tenants', {
      type: tenantType,
      resolve: (root, args, ctx) => {
        return ctx.prisma.tenant.findMany();
      },
    });
  },
});

export const currentTenantQuery = queryField('currentTenant', {
  type: tenantType,
  resolve: (source, args, context) => context.tenant,
});
