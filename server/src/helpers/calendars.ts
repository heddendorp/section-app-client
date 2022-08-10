import * as express from 'express';
import ical, { ICalCalendarMethod } from 'ical-generator';
import {
  MembershipStatus,
  PublicationState,
  RegistrationStatus,
} from '../generated/prisma';
import prisma from '../client';

export const calendarRouter = () => {
  const router = express.Router();

  router.get('/public', async (req, res) => {
    const events = await prisma.tumiEvent.findMany({
      where: {
        publicationState: PublicationState.PUBLIC,
        participantSignup: { has: MembershipStatus.NONE },
      },
    });
    const calendar = ical({
      name: 'TUMi public events',
      ttl: 60 * 60 * 2,
      method: ICalCalendarMethod.PUBLISH,
      prodId: {
        company: 'TUMi e.V.',
        product: 'All Events',
      },
    });
    events.forEach((event) => {
      let addon = {};
      if (
        typeof event.coordinates === 'object' &&
        !Array.isArray(event.coordinates) &&
        event.coordinates?.lat
      ) {
        addon = {
          location: {
            title: event.location,
            geo: {
              lat: event.coordinates?.lat,
              lon: event.coordinates?.lon ?? event.coordinates?.lng,
            },
          },
        };
      }
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.title,
        description: `More info at: https://tumi.esn.world/events/${event.id}`,
        url: `https://tumi.esn.world/events/${event.id}`,
        ...addon,
      });
    });
    calendar.serve(res);
  });
  router.get('/private/:token', async (req, res) => {
    const token = req.params.token;
    const user = await prisma.user.findUnique({
      where: { calendarToken: token },
    });
    const events = await prisma.tumiEvent.findMany({
      where: {
        registrations: {
          some: {
            userId: user?.id,
            status: { not: RegistrationStatus.CANCELLED },
          },
        },
      },
      include: {
        eventTemplate: { include: { tenant: true } },
        registrations: {
          where: {
            user: { id: user?.id },
            status: { not: RegistrationStatus.CANCELLED },
          },
        },
      },
    });
    const calendar = ical({
      name: `TUMi events for ${user?.firstName}`,
      ttl: 60 * 60 * 2,
      method: ICalCalendarMethod.PUBLISH,
      prodId: {
        company: 'TUMi e.V.',
        product: 'Events',
      },
    });

    events.forEach((event) => {
      let addon = {};
      if (
        typeof event.coordinates === 'object' &&
        !Array.isArray(event.coordinates) &&
        event.coordinates?.lat
      ) {
        addon = {
          location: {
            title: event.location,
            geo: {
              lat: event.coordinates?.lat,
              lon: event.coordinates?.lon ?? event.coordinates?.lng,
            },
          },
        };
      }
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.title,
        description: `
Event by: ${event.eventTemplate.tenant.name}
You are registered for this events as ${event.registrations[0].type.toLocaleLowerCase()}.
More info at: https://tumi.esn.world/events/${event.id}`,
        url: `https://tumi.esn.world/events/${event.id}`,
        ...addon,
      });
    });
    calendar.serve(res);
  });
  return router;
};
