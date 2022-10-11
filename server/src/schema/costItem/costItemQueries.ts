import { builder } from '../../builder';
import { costItemType } from './costItemType';
import prisma from '../../client';
import {
  BlobServiceClient,
  ContainerSASPermissions,
} from '@azure/storage-blob';

builder.queryFields((t) => ({
  costItems: t.prismaField({
    authScopes: { member: true },
    type: [costItemType],
    args: {
      eventId: t.arg.id(),
    },
    resolve: (query, parent, args, context, info) => {
      return prisma.costItem.findMany({
        ...query,
        where: {
          event: {
            id: args.eventId ?? undefined,
          },
        },
      });
    },
  }),
  costItem: t.prismaField({
    authScopes: { member: true },
    type: costItemType,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.costItem.findUniqueOrThrow({
        ...query,
        where: { id: args.id },
      });
    },
  }),
  blobUploadKey: t.string({
    authScopes: { member: true },
    resolve: async () =>
      BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient('tumi')
        .generateSasUrl({
          permissions: ContainerSASPermissions.parse('c'),
          expiresOn: new Date(Date.now() + 3600 * 1000),
        }),
  }),
}));
