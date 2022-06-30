import { builder } from '../../builder';
import prisma from '../../client';
import { createUserInputType, updateUserInputType } from './userType';
import { removeEmpty } from '../helperFunctions';

builder.mutationFields((t) => ({
  createUser: t.prismaField({
    authScopes: {
      authenticated: true,
    },
    type: 'User',
    args: {
      input: t.arg({ required: true, type: createUserInputType }),
    },
    resolve: async (query, root, { input }, context) => {
      const { email, email_verified, picture } =
        await context.auth0.getUserInfo(context.token?.sub ?? '');
      return prisma.user.upsert({
        ...query,
        where: {
          authId: context.token?.sub ?? '',
        },
        update: {
          email,
          email_verified,
          picture,
          ...input,
        },
        create: {
          ...input,
          authId: context.token?.sub ?? '',
          email,
          email_verified,
          picture,
          tenants: {
            create: {
              tenant: {
                connect: {
                  id: context.tenant.id,
                },
              },
            },
          },
        },
      });
    },
  }),
  updateUser: t.prismaField({
    type: 'User',
    args: {
      userId: t.arg.id({ required: true }),
      input: t.arg({ type: updateUserInputType, required: true }),
    },
    resolve: async (query, root, { userId, input }, context) => {
      return prisma.user.update({
        ...query,
        where: { id: userId },
        data: removeEmpty(input),
      });
    },
  }),
  updateESNCard: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.id({ required: true }),
      esnCardOverride: t.arg.boolean({ required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.user.update({
        ...query,
        where: { id: args.id },
        data: { esnCardOverride: args.esnCardOverride },
      }),
  }),
}));
