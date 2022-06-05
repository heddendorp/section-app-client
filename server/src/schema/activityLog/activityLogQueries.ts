import { builder } from '../../builder';
import { activityLogStatType, activityLogType } from './activityLogType';
import prisma from '../../client';

builder.queryFields((t) => ({
  logs: t.prismaField({
    authScopes: {
      admin: true,
    },
    type: [activityLogType],
    resolve: async (query, parent, args, context, info) => {
      return prisma.activityLog.findMany({
        ...query,
        orderBy: { createdAt: 'desc' },
      });
    },
  }),
  logStats: t.field({
    authScopes: {
      admin: true,
    },
    type: [activityLogStatType],
    resolve: async (parent, args, context, info) => {
      return prisma.activityLog
        .groupBy({
          by: ['message'],
          orderBy: { _count: { message: 'desc' } },
          _count: { message: true },
        })
        .then((res: any[]) => {
          return res.map((stat) => ({
            message: stat.message,
            count: stat._count.message,
          }));
        });
    },
  }),
}));
