import { objectType } from 'nexus';
import { EventSubmission } from '../nexus';

export const eventSubmissionType = objectType({
  name: EventSubmission.$name,
  description: EventSubmission.$description,
  definition(t) {
    t.field(EventSubmission.id);
    t.field(EventSubmission.createdAt);
    t.field({
      ...EventSubmission.registration,
      resolve: (source, args, context) =>
        context.prisma.eventRegistration.findUnique({
          where: { id: source.eventRegistrationId },
        }),
    });
    t.field(EventSubmission.eventRegistrationId);
    t.field({
      ...EventSubmission.submissionItem,
      resolve: (source, args, context) =>
        context.prisma.eventSubmissionItem.findUnique({
          where: { id: source.submissionItemId },
        }),
    });
    t.field(EventSubmission.submissionItemId);
    t.field(EventSubmission.data);
  },
});
