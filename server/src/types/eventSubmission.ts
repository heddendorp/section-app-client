import { objectType } from 'nexus';
import { EventSubmission } from '../generated/nexus-prisma';

export const eventSubmissionType = objectType({
  name: EventSubmission.$name,
  description: EventSubmission.$description,
  definition(t) {
    t.field(EventSubmission.id);
    t.field(EventSubmission.createdAt);
    t.field(EventSubmission.registration);
    t.field(EventSubmission.eventRegistrationId);
    t.field(EventSubmission.submissionItem);
    t.field(EventSubmission.submissionItemId);
    t.field(EventSubmission.data);
  },
});
