import cron from 'node-cron';
import {
  PrismaClient,
  RegistrationStatus,
  RegistrationType,
} from '../generated/prisma';
export const setupCronjob = (prisma: PrismaClient) => {
  cron.schedule('* 4 * * *', async () => {
    console.log('checking db consistency');
    const events = await prisma.tumiEvent.findMany({
      select: { id: true, participantRegistrationCount: true },
    });
    for (const event of events) {
      const participantRegistrationCount = await prisma.eventRegistration.count(
        {
          where: {
            event: { id: event.id },
            status: { not: RegistrationStatus.CANCELLED },
            type: RegistrationType.PARTICIPANT,
          },
        }
      );
      if (event.participantRegistrationCount !== participantRegistrationCount) {
        await prisma.tumiEvent.update({
          where: { id: event.id },
          data: { participantRegistrationCount },
        });
        if (process.env.NODE_ENV !== 'development') {
          await prisma.activityLog.create({
            data: {
              data: JSON.parse(
                JSON.stringify({ event, participantRegistrationCount })
              ),
              message: 'Mismatch of participant registration count',
              severity: 'WARNING',
              category: 'database',
            },
          });
        } else {
          console.log(
            `updated participantRegistrationCount for event ${event.id}`
          );
        }
      }
    }
    console.log('events updated');
  });
};
