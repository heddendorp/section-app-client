import { builder } from '../../builder';
import prisma from '../../client';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  Role,
} from '../../generated/prisma';
import TumiEventWhereInput = Prisma.TumiEventWhereInput;

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
    resolve: async (query, parent, { after, limit }, context, info) => {
      let where: TumiEventWhereInput;
      after ??= new Date();
      const { role, status } = context.userOfTenant ?? {};
      if (!context.user) {
        where = {
          participantSignup: {
            has: MembershipStatus.NONE,
          },
          end: { gt: new Date() },
          publicationState: PublicationState.PUBLIC,
        };
      } else if (role === Role.ADMIN) {
        where = { end: { gt: after } };
      } else {
        where = {
          end: { gt: after },
          OR: [
            {
              participantSignup: {
                has: status,
              },
              publicationState: PublicationState.PUBLIC,
            },
            {
              createdBy: { id: context.user.id },
            },
            {
              organizerSignup: { has: status },
              publicationState: {
                in: [PublicationState.PUBLIC, PublicationState.ORGANIZERS],
              },
            },
          ],
        };
      }
      return prisma.tumiEvent.findMany({
        ...query,
        where,
        ...(limit ? { take: limit } : {}),
        orderBy: { start: 'asc' },
      });
    },
  }),
}));
