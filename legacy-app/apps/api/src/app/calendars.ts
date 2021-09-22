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
        url: `https://esn.tumi.world/events/${event.id}`,
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
  return router;
};
