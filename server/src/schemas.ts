import { z } from 'zod';

export const ResourceLink = z.object({
  url: z.string().url(),
  icon: z.string(),
  label: z.string(),
});
export type ResourceLink = z.infer<typeof ResourceLink>;

export const DeregistrationOptions = z
  .object({
    minimumDays: z.number().int().min(0).default(5),
    refundFees: z.boolean().default(true),
  })
  .default({});
export type DeregistrationOptions = z.infer<typeof DeregistrationOptions>;

export const TenantSettings = z.object({
  socialLinks: z.array(ResourceLink),
  sectionHubLinks: z.array(ResourceLink),
  brandIconUrl: z.string().url().optional(),
  showPWAInstall: z.boolean(),
  deregistrationOptions: DeregistrationOptions,
});
export type TenantSettings = z.infer<typeof TenantSettings>;
