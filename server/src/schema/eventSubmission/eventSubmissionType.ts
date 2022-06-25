import { builder } from '../../builder';

export const eventSubmissionType = builder.prismaObject('EventSubmission', {
  findUnique: (eventSubmission) => ({ id: eventSubmission.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    registration: t.relation('registration'),
    registrationId: t.exposeID('eventRegistrationId', { nullable: true }),
    submissionItem: t.relation('submissionItem'),
    submissionItemId: t.exposeID('submissionItemId'),
    data: t.expose('data', { type: 'JSON' }),
  }),
});
