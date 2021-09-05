import * as NexusPrismaScalars from 'nexus-prisma/scalars';
import { User, Tenant } from 'nexus-prisma';
import { extendType, makeSchema, objectType } from 'nexus';

const tenantType = objectType({
  name: Tenant.$name,
  description: Tenant.$description,
  definition(t) {
    t.field(Tenant.id);
    t.field(Tenant.name);
    t.field(Tenant.createdAt);
    t.field(Tenant.shortName);
  },
});

const tenantQuery = extendType({
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

export const schema = makeSchema({
  types: [NexusPrismaScalars, tenantType, tenantQuery],
});
