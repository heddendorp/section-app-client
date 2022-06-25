import { builder } from '../../builder';
import prisma from '../../client';
import { removeEmpty } from '../helperFunctions';

builder.mutationFields((t) => ({
  updateTenant: t.prismaField({
    type: 'Tenant',
    args: {
      id: t.arg.id({ required: true }),
      updateTenantInput: t.arg({ type: updateTenantInputType, required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.tenant.update({
        ...query,
        where: { id: args.id },
        data: removeEmpty(args.updateTenantInput),
      }),
  }),
}));

const updateTenantInputType = builder.inputType('UpdateTenantInput', {
  fields: (t) => ({
    imprintPage: t.string(),
    privacyPolicyPage: t.string(),
    aboutPage: t.string(),
    faqPage: t.string(),
    tacPage: t.string(),
  }),
});
