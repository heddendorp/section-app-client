import { builder } from '../../builder';
import prisma from '../../client';
import {
  BlobServiceClient,
  ContainerSASPermissions,
} from '@azure/storage-blob';

builder.queryFields((t) => ({
  photos: t.prismaField({
    type: ['PhotoShare'],
    args: {
      eventId: t.arg.id(),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.photoShare.findMany({
        ...query,
        ...(args.eventId ? { where: { eventId: args.eventId } } : {}),
        orderBy: [{ event: { start: 'desc' } }, { createdAt: 'desc' }],
      }),
  }),
  photoShareKey: t.string({
    authScopes: { public: true },
    resolve: async () =>
      BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient('tumi-photos')
        .generateSasUrl({
          permissions: ContainerSASPermissions.parse('c'),
          expiresOn: new Date(Date.now() + 3600 * 1000),
        }),
  }),
}));
