import { builder } from '../../builder';

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    registrations: t.relation('eventRegistrations'),
    createdEvents: t.relation('createdEvents'),
  }),
});
