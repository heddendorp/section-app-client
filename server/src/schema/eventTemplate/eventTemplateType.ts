import { builder } from '../../builder';

export const eventTemplateType = builder.prismaObject('EventTemplate', {
  findUnique: (eventTemplate) => ({
    id: eventTemplate.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    title: t.exposeString('title'),
    icon: t.exposeString('icon'),
    description: t.exposeString('description'),
    comment: t.exposeString('comment'),
    location: t.exposeString('location'),
    coordinates: t.expose('coordinates', { type: 'JSON' }),
    duration: t.expose('duration', { type: 'Decimal' }),
    participantText: t.exposeString('participantText'),
    organizerText: t.exposeString('organizerText'),
    finances: t.expose('finances', { type: 'JSON' }),
    insuranceDescription: t.exposeString('insuranceDescription'),
    shouldBeReportedToInsurance: t.exposeBoolean('shouldBeReportedToInsurance'),
    eventInstances: t.relation('eventInstances', {
      query: { orderBy: { start: 'desc' } },
    }),
    tenant: t.relation('tenant'),
  }),
});
