import { builder } from '../../builder';

export const organizerType = builder.prismaObject('EventOrganizer', {
  findUnique: (organizer) => ({ id: organizer.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    tenant: t.relation('tenant'),
    tenantId: t.exposeID('tenantId'),
    name: t.exposeString('name'),
    text: t.exposeString('text'),
    link: t.exposeString('link', { nullable: true }),
    events: t.relation('events'),
  }),
});

export const newOrganizerInputType = builder.inputType('NewOrganizerInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    text: t.string({ required: true }),
    link: t.string(),
  }),
});
