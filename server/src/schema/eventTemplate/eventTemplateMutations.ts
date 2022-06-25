import { builder } from '../../builder';
import {
  createEventTemplateInput,
  updateTemplateInputType,
  updateTemplateLocationInputType,
} from './eventTemplateType';
import prisma from '../../client';

builder.mutationFields((t) => ({
  createEventTemplate: t.prismaField({
    authScopes: { member: true },
    type: 'EventTemplate',
    args: {
      input: t.arg({
        type: createEventTemplateInput,
        required: true,
      }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.eventTemplate.create({
        ...query,
        data: {
          ...args.input,
          finances: {},
          tenant: {
            connect: {
              id: context.tenant.id,
            },
          },
        },
      });
    },
  }),
  updateTemplate: t.prismaField({
    authScopes: { member: true },
    type: 'EventTemplate',
    args: {
      templateId: t.arg.id({ required: true }),
      input: t.arg({ required: true, type: updateTemplateInputType }),
    },
    resolve: async (query, parent, { templateId, input }, context) => {
      return prisma.eventTemplate.update({
        ...query,
        where: {
          id: templateId,
        },
        data: {
          ...removeEmpty(input),
        },
      });
    },
  }),
  updateTemplateFinances: t.prismaField({
    authScopes: { member: true },
    type: 'EventTemplate',
    args: {
      templateId: t.arg.id({ required: true }),
      finances: t.arg({ required: true, type: 'JSON' }),
    },
    resolve: async (query, parent, { templateId, finances }, context) => {
      return prisma.eventTemplate.update({
        ...query,
        where: {
          id: templateId,
        },
        data: {
          finances: finances,
        },
      });
    },
  }),
  updateTemplateLocation: t.prismaField({
    authScopes: { member: true },
    type: 'EventTemplate',
    args: {
      templateId: t.arg.id({ required: true }),
      location: t.arg({
        required: true,
        type: updateTemplateLocationInputType,
      }),
    },
    resolve: async (query, parent, { templateId, location }, context) => {
      return prisma.eventTemplate.update({
        ...query,
        where: {
          id: templateId,
        },
        data: {
          ...location,
        },
      });
    },
  }),
  deleteTemplate: t.prismaField({
    authScopes: { admin: true },
    type: 'EventTemplate',
    args: {
      templateId: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, { templateId }, context) => {
      return prisma.eventTemplate.delete({
        ...query,
        where: {
          id: templateId,
        },
      });
    },
  }),
}));
