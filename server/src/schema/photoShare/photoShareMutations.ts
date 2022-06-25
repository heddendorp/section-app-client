import { builder } from '../../builder';
import { createPhotoShareInputType } from './photoShareType';
import prisma from '../../client';

builder.mutationFields((t) => ({
  createPhotoShare: t.prismaField({
    authScopes: {
      public: true,
    },
    type: 'PhotoShare',
    args: {
      input: t.arg({ required: true, type: createPhotoShareInputType }),
      eventId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { input, eventId }, context) => {
      // TODO: create image thumbnails
      return prisma.photoShare.create({
        ...query,
        data: {
          ...input,
          event: { connect: { id: eventId } },
          creator: { connect: { id: context.user?.id } },
        },
      });
    },
  }),
}));
