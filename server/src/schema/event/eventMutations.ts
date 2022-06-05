import { builder } from '../../builder';
import prisma from '../../client';
import { RegistrationStatus } from '../../generated/prisma';
import { GraphQLError } from 'graphql';

builder.mutationFields((t) => ({
  rateEvent: t.prismaField({
    type: 'TumiEvent',
    args: {
      id: t.arg.id({ required: true }),
      rating: t.arg.int({ required: true }),
      comment: t.arg.string({ defaultValue: '' }),
    },
    resolve: async (query, root, { id, rating, comment }, context) => {
      const registration = await prisma.eventRegistration.findFirst({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: {
            id,
          },
          user: {
            id: context.user?.id,
          },
        },
      });
      if (!registration) throw new GraphQLError('Registration not found!');
      return prisma.tumiEvent.update({
        ...query,
        where: {
          id,
        },
        data: {
          registrations: {
            update: {
              where: { id: registration.id },
              data: {
                rating,
                userComment: comment,
              },
            },
          },
        },
      });
    },
  }),
}));
