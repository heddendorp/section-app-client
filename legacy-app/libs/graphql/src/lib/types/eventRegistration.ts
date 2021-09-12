import { objectType } from 'nexus';
import { EventRegistration } from 'nexus-prisma';

export const eventRegistrationType = objectType({
  name: EventRegistration.$name,
  description: EventRegistration.$description,
  definition(t) {
    t.field(EventRegistration.id);
    t.field(EventRegistration.createdAt);
    t.field(EventRegistration.type);
    t.field(EventRegistration.user);
    t.field(EventRegistration.userId);
    t.field(EventRegistration.event);
    t.field(EventRegistration.eventId);
  },
});
