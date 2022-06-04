import { builder } from '../../builder';

builder.prismaObject('EventRegistration', {
  findUnique: (eventRegistration) => ({
    id: eventRegistration.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    event: t.relation('event'),
    user: t.relation('user'),
  }),
});
