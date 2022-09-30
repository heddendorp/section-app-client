import { builder } from '../../builder';
import prisma from '../../client';
import { MembershipStatus, PurchaseStatus, Role } from '../../generated/prisma';
import { GraphQLYogaError } from '@graphql-yoga/node';
import { prepareSearchString } from '../helperFunctions';
import {
  BlobServiceClient,
  ContainerSASPermissions,
} from '@azure/storage-blob';

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
      emptyOnEmptySearch: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (
      query,
      root,
      {
        statusList,
        roleList,
        search,
        pageLength,
        pageIndex,
        onlyWithPurchase,
        emptyOnEmptySearch,
      },
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
      } else if (emptyOnEmptySearch) {
        return [];
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
      prisma.user.findUniqueOrThrow({ ...query, where: { id: args.id } }),
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
  profileUploadKey: t.string({
    authScopes: { member: true },
    resolve: async () =>
      BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient('tumi-profile')
        .generateSasUrl({
          permissions: ContainerSASPermissions.parse('c'),
          expiresOn: new Date(Date.now() + 3600 * 1000),
        }),
  }),
}));
