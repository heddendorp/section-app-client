import { builder } from '../../builder';

export const eventTemplateCategoryType = builder.prismaObject(
  'EventTemplateCategory',
  {
    findUnique: (eventTemplateCategory) => ({
      id: eventTemplateCategory.id,
    }),
    fields: (t) => ({
      id: t.exposeID('id'),
      createdAt: t.expose('createdAt', { type: 'DateTime' }),
      name: t.exposeString('name'),
      icon: t.exposeString('icon'),
      templates: t.relation('templates', {
        query: (args, context) => ({ orderBy: { title: 'asc' } }),
      }),
      templateCount: t.relationCount('templates'),
      tenant: t.relation('tenant'),
      tenantId: t.exposeID('tenantId'),
    }),
  }
);

export const createEventTemplateCategoryInput = builder.inputType(
  'CreateEventTemplateCategoryInput',
  {
    fields: (t) => ({
      name: t.string({ required: true }),
      icon: t.string({ required: true }),
    }),
  }
);
