import { builder } from '../../builder';
import { newOrganizerInputType, organizerType } from './organizerType';
import prisma from '../../client';

builder.mutationFields((t) => ({
  createEventOrganizer: t.prismaField({
    type: organizerType,
    args: {
      newOrganizerInput: t.arg({ type: newOrganizerInputType, required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.eventOrganizer.create({
        ...query,
        data: {
          ...args.newOrganizerInput,
          tenant: { connect: { id: context.tenant.id } },
        },
      });
    },
  }),
}));
