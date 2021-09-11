import { objectType } from 'nexus';
import { TumiEvent } from 'nexus-prisma';

export const eventType = objectType({
  name: TumiEvent.$name,
  description: TumiEvent.$description,
  definition(t) {
    t.field(TumiEvent.id);
    t.field(TumiEvent.createdAt);
    t.field(TumiEvent.title);
    t.field(TumiEvent.icon);
    t.field(TumiEvent.start);
    t.field(TumiEvent.end);
    t.field(TumiEvent.description);
    t.field(TumiEvent.location);
    t.field(TumiEvent.participantText);
    t.field(TumiEvent.participantMail);
    t.field(TumiEvent.organizerText);
    t.field(TumiEvent.publicationState);
    // t.field(TumiEvent.submissionItems);
    // t.field(TumiEvent.registrations);
    // t.field(TumiEvent.costItems);
    t.field(TumiEvent.photoShare);
    t.field(TumiEvent.eventTemplate);
    t.field(TumiEvent.eventTemplateId);
  },
});
