import { builder } from '../../builder';
import prisma from '../../client';
import { RegistrationStatus, RegistrationType } from '../../generated/prisma';

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
    googlePlaceId: t.exposeString('googlePlaceId', { nullable: true }),
    googlePlaceUrl: t.exposeString('googlePlaceUrl', { nullable: true }),
    coordinates: t.expose('coordinates', { type: 'JSON', nullable: true }),
    duration: t.expose('duration', { type: 'Decimal' }),
    participantText: t.exposeString('participantText'),
    organizerText: t.exposeString('organizerText'),
    finances: t.expose('finances', { type: 'JSON' }),
    insuranceDescription: t.exposeString('insuranceDescription'),
    shouldBeReportedToInsurance: t.exposeBoolean('shouldBeReportedToInsurance'),
    eventInstances: t.relation('eventInstances', {
      query: { orderBy: { start: 'desc' } },
    }),
    eventInstanceCount: t.relationCount('eventInstances'),
    tenant: t.relation('tenant'),
    category: t.relation('category', { nullable: true }),
    medianParticipantCount: t.int({
      resolve: async (eventTemplate) =>
        prisma.tumiEvent
          .findMany({
            where: {
              eventTemplateId: eventTemplate.id,
            },
            select: {
              participantLimit: true,
            },
            orderBy: [{ participantLimit: 'asc' }],
          })
          .then((events) => {
            const count = events.length;
            if (count === 0) {
              return 22;
            }
            const middle = Math.floor(count / 2);
            return events[middle].participantLimit;
          }),
    }),
    medianOrganizerCount: t.int({
      resolve: async (eventTemplate) =>
        prisma.tumiEvent
          .findMany({
            where: {
              eventTemplateId: eventTemplate.id,
            },
            select: {
              organizerLimit: true,
            },
            orderBy: [{ participantLimit: 'asc' }],
          })
          .then((events) => {
            const count = events.length;
            if (count === 0) {
              return 3;
            }
            const middle = Math.floor(count / 2);
            return events[middle].organizerLimit;
          }),
    }),
    participantRating: t.float({
      nullable: true,
      resolve: async (eventTemplate) =>
        prisma.eventRegistration
          .aggregate({
            where: {
              status: { not: RegistrationStatus.CANCELLED },
              type: RegistrationType.PARTICIPANT,
              event: {
                eventTemplate: {
                  id: eventTemplate.id,
                },
              },
              rating: { not: null },
            },
            _avg: {
              rating: true,
            },
          })
          .then(({ _avg }) => _avg.rating),
    }),
    participantRatingCount: t.int({
      nullable: true,
      resolve: async (eventTemplate) =>
        prisma.eventRegistration.count({
          where: {
            status: { not: RegistrationStatus.CANCELLED },
            type: RegistrationType.PARTICIPANT,
            event: {
              eventTemplate: {
                id: eventTemplate.id,
              },
            },
            rating: { not: null },
          },
        }),
    }),
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
      insuranceDescription: t.string({ defaultValue: '' }),
      location: t.string({ required: true }),
      googlePlaceId: t.string({ required: true }),
      googlePlaceUrl: t.string({ required: true }),
      organizerText: t.string({ required: true }),
      participantText: t.string({ required: true }),
      shouldBeReportedToInsurance: t.boolean({ required: true }),
      title: t.string({ required: true }),
      categoryId: t.id({ required: true }),
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
      coordinates: t.field({ type: 'JSON' }),
      googlePlaceId: t.string(),
      googlePlaceUrl: t.string(),
    }),
  }
);
