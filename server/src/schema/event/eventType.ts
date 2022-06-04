import { builder } from '../../builder';

export const eventType = builder.prismaObject('TumiEvent', {
  findUnique: (event) => ({ id: event.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    icon: t.exposeString('icon'),
    description: t.exposeString('description'),
    start: t.field({
      type: 'DateTime',
      resolve: (event) => event.start,
    }),
  }),
});
