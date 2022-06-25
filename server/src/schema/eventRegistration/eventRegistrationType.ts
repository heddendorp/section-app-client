import { builder } from '../../builder';
import { RegistrationStatus, RegistrationType } from '../../generated/prisma';
import prisma from '../../client';

export const eventRegistrationType = builder.prismaObject('EventRegistration', {
  findUnique: (eventRegistration) => ({
    id: eventRegistration.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    type: t.expose('type', { type: RegistrationType }),
    user: t.relation('user'),
    userId: t.exposeID('userId'),
    event: t.relation('event'),
    eventId: t.exposeID('eventId'),
    transaction: t.relation('transaction', { nullable: true }),
    transactionId: t.exposeID('transactionId', { nullable: true }),
    checkInTime: t.expose('checkInTime', { type: 'DateTime', nullable: true }),
    manualCheckin: t.expose('manualCheckin', { type: 'Boolean' }),
    status: t.expose('status', { type: RegistrationStatus }),
    cancellationReason: t.exposeString('cancellationReason', {
      nullable: true,
    }),
    submissions: t.relation('submissions'),
    rating: t.exposeInt('rating', { nullable: true }),
    userComment: t.exposeString('userComment', { nullable: true }),
    didAttend: t.boolean({ resolve: (source) => !!source.checkInTime }),
    belongsToCurrentUser: t.boolean({
      resolve: (source, args, context) => source.userId === context.user?.id,
    }),
    deletingCode: t.prismaField({
      type: 'EventRegistrationCode',
      nullable: true,
      resolve: async (query, parent, args, context, info) => {
        return prisma.eventRegistrationCode.findFirst({
          ...query,
          where: { registrationToRemoveId: parent.id },
          rejectOnNotFound: false,
        });
      },
    }),
    creatingCode: t.prismaField({
      type: 'EventRegistrationCode',
      nullable: true,
      resolve: async (query, parent, args, context, info) => {
        return prisma.eventRegistrationCode.findFirst({
          ...query,
          rejectOnNotFound: false,
          where: { registrationCreatedId: parent.id },
        });
      },
    }),
  }),
});
