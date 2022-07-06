import { builder } from '../../builder';
import prisma from '../../client';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  Role,
} from '../../generated/prisma';
import TumiEventWhereInput = Prisma.TumiEventWhereInput;
import { before } from 'lodash';

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
      before: t.arg({ type: 'DateTime', required: false }),
      limit: t.arg.int(),
    },
    resolve: async (query, parent, { before, after, limit }, context, info) => {
      let where: TumiEventWhereInput;
      after ??= new Date();
      const { role, status } = context.userOfTenant ?? {};
      if (!context.user || !context.userOfTenant) {
        where = {
          participantSignup: {
            has: MembershipStatus.NONE,
          },
          end: { gt: after },
          ...(before ? { start: { lt: before } } : {}),
          publicationState: PublicationState.PUBLIC,
          eventTemplate: {
            tenant: {
              id: context.tenant.id,
            },
          },
        };
      } else if (role === Role.ADMIN) {
        where = {
          end: { gt: after },
          ...(before ? { start: { lt: before } } : {}),
          eventTemplate: {
            tenant: {
              id: context.tenant.id,
            },
          },
        };
      } else {
        where = {
          end: { gt: after },
          ...(before ? { start: { lt: before } } : {}),
          eventTemplate: {
            tenant: {
              id: context.tenant.id,
            },
          },
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
