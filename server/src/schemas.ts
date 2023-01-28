import { z } from 'zod';

export const ResourceLink = z.object({
  url: z.string().url(),
  icon: z.string(),
  label: z.string(),
});
export type ResourceLink = z.infer<typeof ResourceLink>;

export const TenantSettings = z.object({
  socialLinks: z.array(ResourceLink),
  sectionHubLinks: z.array(ResourceLink),
  brandIconUrl: z.string().url().optional(),
  showPWAInstall: z.boolean(),
});
export type TenantSettings = z.infer<typeof TenantSettings>;
