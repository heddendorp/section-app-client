import { idArg, list, nonNull, objectType, queryField } from 'nexus';
import { EventTemplateCategory } from 'nexus-prisma';
import { CacheScope } from 'apollo-server-types';

export const eventTemplateCategoryType = objectType({
  name: EventTemplateCategory.$name,
  definition(t) {
    t.field(EventTemplateCategory.id);
    t.field(EventTemplateCategory.createdAt);
    t.field(EventTemplateCategory.name);
    t.field(EventTemplateCategory.icon);
    t.field({
      ...EventTemplateCategory.templates,
      resolve: ({ id }, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 60,
          scope: CacheScope.Public,
        });
        return context.prisma.eventTemplateCategory
          .findUnique({
            where: { id },
          })
          .templates();
      },
    });
  },
});

export const getEventTemplateCategoryListQuery = queryField(
  'templateCategories',
  {
    type: nonNull(list(nonNull(eventTemplateCategoryType))),
    resolve: (source, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
      return context.prisma.eventTemplateCategory.findMany({
        where: { tenantId: context.tenant.id },
      });
    },
  }
);

export const getEventTemplateCategoryQuery = queryField('templateCategory', {
  type: eventTemplateCategoryType,
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context, info) => {
    info.cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
    return context.prisma.eventTemplateCategory.findUnique({
      where: { id },
    });
  },
});
