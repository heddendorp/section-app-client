import { builder } from '../../builder';
import prisma from '../../client';
import { removeEmpty } from '../helperFunctions';
import { HomePageStrategy } from '../../generated/prisma';

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

const updateResourceLinkInputType = builder.inputType(
  'UpdateResourceLinkInput',
  {
    fields: (t) => ({
      label: t.string(),
      url: t.string(),
      icon: t.string(),
    }),
  }
);

const updateTenantSettingsInputType = builder.inputType(
  'UpdateTenantSettingsInput',
  {
    fields: (t) => ({
      socialLinks: t.field({ type: [updateResourceLinkInputType] }),
      sectionHubLinks: t.field({ type: [updateResourceLinkInputType] }),
      showPWAInstall: t.boolean(),
      brandIconUrl: t.string({ required: false }),
      deregistrationOptions: t.field({
        type: updateDeregistrationOptionsInputType,
      }),
    }),
  }
);

const updateDeregistrationOptionsInputType = builder.inputType(
  'UpdateDeregistrationOptionsInput',
  {
    fields: (t) => ({
      refundFees: t.boolean(),
      minimumDays: t.int(),
    }),
  }
);

const updateTenantInputType = builder.inputType('UpdateTenantInput', {
  fields: (t) => ({
    imprintPage: t.string(),
    privacyPolicyPage: t.string(),
    aboutPage: t.string(),
    faqPage: t.string(),
    tacPage: t.string(),
    communicationEmail: t.string(),
    homePageStrategy: t.field({ type: HomePageStrategy }),
    homePageLink: t.string(),
    settings: t.field({ type: updateTenantSettingsInputType }),
  }),
});
