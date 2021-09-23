import * as express from 'express';
import { PrismaClient, PublicationState } from '@tumi/server-models';
import ical from 'ical-generator';

export const calendarRouter = (prisma: PrismaClient) => {
  const router = express.Router();

  router.get('/public', async (req, res) => {
    const events = await prisma.tumiEvent.findMany({
      where: { publicationState: PublicationState.PUBLIC },
    });
    const calendar = ical({ name: 'TUMi public events' });
    events.forEach((event) =>
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.title,
        description: `More info at: https://tumi.esn.world/events/${event.id}`,
        url: `https://tumi.esn.world/events/${event.id}`,
      })
    );
    // calendar.createEvent({
    //   start: DateTime.local(),
    //   end: DateTime.local().plus({ hours: 1 }),
    //   summary: 'Example Event',
    //   description: 'It works ;)',
    //   location: 'my room',
    //   url: 'http://sebbo.net/',
    // });
    calendar.serve(res);
  });
  router.get('/private/:token', async (req, res) => {
    const token = req.params.token;
    const user = await prisma.user.findUnique({
      where: { calendarToken: token },
    });
    const events = await prisma.tumiEvent.findMany({
      where: { registrations: { some: { userId: user.id } } },
      include: {
        eventTemplate: { include: { tenant: true } },
        registrations: { where: { user: { id: user.id } } },
      },
    });
    const calendar = ical({ name: `TUMi events for ${user.firstName}` });
    events.forEach((event) =>
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.title,
        description: `
        Event by: ${event.eventTemplate.tenant.name}
        You are registered for this events as ${event.registrations[0].type.toLocaleLowerCase()}.
        More info at: https://tumi.esn.world/events/${event.id}`,
        url: `https://tumi.esn.world/events/${event.id}`,
      })
    );
    calendar.serve(res);
  });
  return router;
};
