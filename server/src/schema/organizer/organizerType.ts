import { builder } from '../../builder';

builder.prismaObject('EventOrganizer', {
  findUnique: (organizer) => ({ id: organizer.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});
