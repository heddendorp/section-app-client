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

export const createEventTemplateInput = builder.inputType(
  'CreateEventTemplateInput',
  {
    fields: (t) => ({
      comment: t.string({ required: true }),
      coordinates: t.field({ required: true, type: 'JSON' }),
      description: t.string({ required: true }),
      duration: t.field({ required: true, type: 'Decimal' }),
      icon: t.string({ required: true }),
      insuranceDescription: t.string({ required: true }),
      location: t.string({ required: true }),
      organizerText: t.string({ required: true }),
      participantText: t.string({ required: true }),
      shouldBeReportedToInsurance: t.boolean({ required: true }),
      title: t.string({ required: true }),
    }),
  }
);

export const updateTemplateInputType = builder.inputType(
  'UpdateTemplateInput',
  {
    fields: (t) => ({
      comment: t.string(),
      description: t.string(),
      duration: t.field({ type: 'Decimal' }),
      icon: t.string(),
      insuranceDescription: t.string(),
      organizerText: t.string(),
      participantText: t.string(),
      shouldBeReportedToInsurance: t.boolean(),
      title: t.string(),
    }),
  }
);

export const updateTemplateLocationInputType = builder.inputType(
  'UpdateTemplateLocationInput',
  {
    fields: (t) => ({
      location: t.string({ required: true }),
      coordinates: t.field({ type: 'JSON', required: true }),
    }),
  }
);
