import { builder } from '../../builder';

export const resourceLinkType = builder.simpleObject('ResourceLink', {
  fields: (t) => ({
    label: t.string(),
    url: t.string(),
    icon: t.string(),
  }),
});
export const deregistrationOptionsType = builder.simpleObject(
  'DeregistrationOptions',
  {
    fields: (t) => ({
      minimumDays: t.int(),
      refundFees: t.boolean(),
    }),
  }
);
export const tenantSettingsType = builder.simpleObject('TenantSettings', {
  fields: (t) => ({
    socialLinks: t.field({ type: [resourceLinkType] }),
    sectionHubLinks: t.field({ type: [resourceLinkType] }),
    showPWAInstall: t.boolean(),
    brandIconUrl: t.string({ nullable: true }),
    deregistrationOptions: t.field({ type: deregistrationOptionsType }),
  }),
});
