import { builder } from '../../builder';

builder.prismaObject('Tenant', {
  findUnique: (tenant) => ({ id: tenant.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    name: t.exposeString('name'),
    shortName: t.exposeString('shortName'),
    organizers: t.relation('organizers'),
    users: t.relation('users'),
    imprintPage: t.exposeString('imprintPage'),
    privacyPolicyPage: t.exposeString('privacyPolicyPage'),
    aboutPage: t.exposeString('aboutPage'),
    faqPage: t.exposeString('faqPage', { nullable: true }),
    tacPage: t.exposeString('tacPage', { nullable: true }),
  }),
});
