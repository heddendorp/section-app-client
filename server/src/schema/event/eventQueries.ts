import { builder } from '../../builder';
import prisma from '../../client';
import {
  MembershipStatus,
  Prisma,
  PublicationState,
  RegistrationStatus,
  RegistrationType,
  Role,
} from '../../generated/prisma';
import { prepareSearchString } from '../helperFunctions';
import TumiEventWhereInput = Prisma.TumiEventWhereInput;

builder.queryFields((t) => ({
  event: t.prismaField({
    type: 'TumiEvent',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.tumiEvent.findUniqueOrThrow({
        ...query,
        where: { id: args.id },
      }),
  }),
  events: t.prismaField({
    type: ['TumiEvent'],
    args: {
      after: t.arg({ type: 'DateTime', required: false }),
      before: t.arg({ type: 'DateTime', required: false }),
      search: t.arg.string({ required: false }),
      limit: t.arg.int(),
      reverseOrder: t.arg.boolean({ required: false }),
    },
    resolve: async (
      query,
      parent,
      { before, after, limit, search, reverseOrder },
      context,
      info
    ) => {
      let where: TumiEventWhereInput;
      after ??= new Date();
      const { role, status } = context.userOfTenant ?? {};
      if (!context.user || !context.userOfTenant) {
        where = {
          participantSignup: {
            has: MembershipStatus.NONE,
          },
          ...(search ? { title: { search: prepareSearchString(search) } } : {}),
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
          ...(search ? { title: { search: prepareSearchString(search) } } : {}),
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
          ...(search ? { title: { search: prepareSearchString(search) } } : {}),
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
        orderBy: { start: reverseOrder ? 'desc' : 'asc' },
      });
    },
  }),
  commonEvents: t.prismaField({
    authScopes: { authenticated: true },
    type: ['TumiEvent'],
    args: {
      id: t.arg.id({ required: true }),
    },
    unauthorizedResolver: () => [],
    resolve: async (query, root, args, context, info) => {
      const user1Events = await prisma.tumiEvent.findMany({
        ...query,
        where: {
          end: {
            lt: new Date(),
          },
          registrations: {
            some: {
              user: { id: context.user?.id },
              status: { not: RegistrationStatus.CANCELLED },
              OR: [
                { checkInTime: { not: null } },
                { type: RegistrationType.ORGANIZER },
              ],
            },
          },
        },
        orderBy: { start: 'desc' },
      });
      const user2Events = await prisma.tumiEvent.findMany({
        ...query,
        where: {
          end: {
            lt: new Date(),
          },
          registrations: {
            some: {
              user: { id: args.id },
              status: { not: RegistrationStatus.CANCELLED },
              OR: [
                { checkInTime: { not: null } },
                { type: RegistrationType.ORGANIZER },
              ],
            },
          },
        },
        orderBy: { start: 'desc' },
      });
      return user1Events.filter((e) =>
        user2Events.some((e2) => e2.id === e.id)
      );
    },
  }),
}));
