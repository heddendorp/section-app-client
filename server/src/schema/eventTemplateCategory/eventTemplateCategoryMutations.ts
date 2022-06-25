import { builder } from '../../builder';
import prisma from '../../client';
import { createEventTemplateCategoryInput } from './eventTemplateCategoryType';

builder.mutationFields((t) => ({
  createEventTemplateCategory: t.prismaField({
    authScopes: { admin: true },
    type: 'EventTemplateCategory',
    args: {
      input: t.arg({
        type: createEventTemplateCategoryInput,
        required: true,
      }),
    },
    resolve: async (query, parent, { input }, context) => {
      return prisma.eventTemplateCategory.create({
        ...query,
        data: {
          ...input,
          tenant: {
            connect: {
              id: context.tenant.id,
            },
          },
        },
      });
    },
  }),
  deleteEventTemplateCategory: t.prismaField({
    authScopes: { admin: true },
    type: 'EventTemplateCategory',
    args: {
      categoryId: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, { categoryId }, context) => {
      return prisma.eventTemplateCategory.delete({
        where: {
          id: categoryId,
        },
      });
    },
  }),
}));
