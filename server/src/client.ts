import { PrismaClient } from './generated/prisma';
import { TenantSettings } from './schemas';

const prisma = new PrismaClient().$extends({
  result: {
    tenant: {
      settings: {
        needs: { settings: true },
        compute({ settings }) {
          return TenantSettings.parse(settings);
        },
      },
    },
  },
  query: {
    tenant: {
      create({ args, query }) {
        args.data.settings = TenantSettings.parse(args.data.settings);
        return query(args);
      },
      createMany({ args, query }) {
        const tenants = Array.isArray(args.data) ? args.data : [args.data];
        for (const tenant of tenants) {
          tenant.settings = TenantSettings.parse(tenant.settings);
        }
        return query(args);
      },
      update({ args, query }) {
        if (args.data.settings !== undefined) {
          args.data.settings = TenantSettings.parse(args.data.settings);
        }
        return query(args);
      },
      updateMany({ args, query }) {
        if (args.data.settings !== undefined) {
          args.data.settings = TenantSettings.parse(args.data.settings);
        }
        return query(args);
      },
      upsert({ args, query }) {
        args.create.settings = TenantSettings.parse(args.create.settings);
        if (args.update.settings !== undefined) {
          args.update.settings = TenantSettings.parse(args.update.settings);
        }
        return query(args);
      },
    },
  },
});
// if (process.env.NODE_ENV !== 'production') {
//   prisma.$use(async (params, next) => {
//     const before = Date.now();
//
//     const result = await next(params);
//
//     const after = Date.now();
//
//     console.log(
//       `Query ${params.model}.${params.action} took ${after - before}ms (${
//         Math.round((after - before) / 10) / 100
//       }s)`
//     );
//     // console.log(JSON.stringify(params, null, 2));
//
//     return result;
//   });
// }
export default prisma;
