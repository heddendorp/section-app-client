import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  event: t.prismaField({
    type: 'TumiEvent',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.tumiEvent.findUnique({
        ...query,
        where: { id: args.id },
      }),
  }),
  events: t.prismaField({
    type: ['TumiEvent'],
    args: {
      after: t.arg({ type: 'DateTime', required: false }),
      limit: t.arg.int(),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.tumiEvent.findMany({
        ...query,
        ...(args.after ? { where: { start: { gte: args.after } } } : {}),
        ...(args.limit ? { take: args.limit } : {}),
      }),
  }),
}));
