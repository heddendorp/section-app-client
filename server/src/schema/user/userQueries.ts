import { builder } from '../../builder';
import prisma from '../../client';
import {
  Role,
  MembershipStatus,
  PurchaseStatus,
  RegistrationStatus,
} from '../../generated/prisma';
import { GraphQLYogaError } from '@graphql-yoga/node';
import { prepareSearchString } from '../helperFunctions';

builder.queryFields((t) => ({
  users: t.prismaField({
    authScopes: {
      member: true,
    },
    type: ['User'],
    args: {
      roleList: t.arg({ type: [Role], defaultValue: Object.values(Role) }),
      statusList: t.arg({
        type: [MembershipStatus],
        defaultValue: Object.values(MembershipStatus),
      }),
      search: t.arg.string(),
      pageIndex: t.arg.int(),
      pageLength: t.arg.int(),
      onlyWithPurchase: t.arg.boolean(),
    },
    resolve: async (
      query,
      root,
      { statusList, roleList, search, pageLength, pageIndex, onlyWithPurchase },
      context,
      info
    ) => {
      const OR: any[] = [];
      let page = {};
      if (typeof pageIndex === 'number' && typeof pageLength === 'number') {
        page = { skip: pageIndex * pageLength, take: pageLength };
      }
      if (search) {
        OR.push({ firstName: { search: prepareSearchString(search) } });
        OR.push({ lastName: { search: prepareSearchString(search) } });
        OR.push({ email: { search: prepareSearchString(search) } });
      }
      return prisma.user.findMany({
        ...query,
        where: {
          ...(search ? { OR } : {}),
          ...(onlyWithPurchase
            ? {
                purchases: {
                  some: { status: { not: PurchaseStatus.CANCELLED } },
                },
              }
            : {}),
          tenants: {
            some: {
              tenantId: context.tenant.id,
              // @ts-ignore
              role: { in: roleList ?? [] },
              // @ts-ignore
              status: { in: statusList ?? [] },
            },
          },
        },
        orderBy: { lastName: 'asc' },
        ...page,
      });
    },
  }),
  userSearchResultNum: t.int({
    args: {
      roleList: t.arg({ type: [Role], defaultValue: Object.values(Role) }),
      statusList: t.arg({
        type: [MembershipStatus],
        defaultValue: Object.values(MembershipStatus),
      }),
      search: t.arg.string(),
    },
    resolve: async (root, { statusList, roleList, search }, context, info) => {
      const OR: any[] = [];
      if (search) {
        OR.push({ firstName: { search: prepareSearchString(search) } });
        OR.push({ lastName: { search: prepareSearchString(search) } });
        OR.push({ email: { search: prepareSearchString(search) } });
      }
      return prisma.user.count({
        where: {
          ...(search ? { OR } : {}),
          tenants: {
            some: {
              tenantId: context.tenant.id,
              // @ts-ignore
              role: { in: roleList },
              // @ts-ignore
              status: { in: statusList },
            },
          },
        },
      });
    },
  }),
  user: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) =>
      prisma.user.findUnique({ ...query, where: { id: args.id } }),
  }),
  commonEvents: t.prismaField({
    type: ['TumiEvent'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, args, context, info) => {
      const user1Events = await prisma.tumiEvent.findMany({
        ...query,
        where: {
          end: {
            lt: new Date(),
          },
          registrations: {
            some: {
              user: { id: context.user.id },
              status: { not: RegistrationStatus.CANCELLED },
            },
          },
        },
        orderBy: { start: 'asc' },
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
            },
          },
        },
        orderBy: { start: 'asc' },
      });
      return user1Events.filter(e => user2Events.some(e2 => e2.id === e.id));
    },
  }),
  currentUser: t.prismaField({
    type: 'User',
    nullable: true,
    resolve: async (query, root, args, ctx, info) => {
      const id = ctx.user?.id;
      if (!id) {
        if (!ctx.token?.sub) {
          throw new GraphQLYogaError('Not authenticated');
        } else {
          return null;
        }
      }
      return prisma.user.findUnique({
        ...query,
        where: { id },
      });
    },
  }),
}));
