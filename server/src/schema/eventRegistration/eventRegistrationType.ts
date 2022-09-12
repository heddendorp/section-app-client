import { builder } from '../../builder';
import {
  Prisma,
  RegistrationStatus,
  RegistrationType,
  TransactionDirection,
  TransactionStatus,
} from '../../generated/prisma';
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
    transactions: t.relation('transactions', {
      args: {
        directions: t.arg({
          type: [TransactionDirection],
        }),
      },
      query: ({ directions }) => ({
        where: directions ? { direction: { in: directions } } : {},
        orderBy: { createdAt: 'desc' },
      }),
    }),
    balance: t.field({
      type: 'Decimal',
      description: 'The sum of all transactions related to this registration',
      resolve: async (source, args, context) => {
        return Promise.all([
          prisma.transaction.aggregate({
            where: {
              direction: TransactionDirection.USER_TO_TUMI,
              eventRegistration: {
                id: source.id,
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              direction: TransactionDirection.TUMI_TO_EXTERNAL,
              eventRegistration: {
                id: source.id,
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              direction: TransactionDirection.TUMI_TO_USER,
              eventRegistration: {
                id: source.id,
              },
              status: TransactionStatus.CONFIRMED,
            },
            _sum: { amount: true },
          }),
        ])
          .then((aggregations) =>
            aggregations.map(
              (aggregation) => aggregation._sum.amount?.toNumber() ?? 0
            )
          )
          .then(
            ([incoming, fees, refunds]) =>
              new Prisma.Decimal(incoming - fees - refunds)
          );
      },
    }),
    checkInTime: t.expose('checkInTime', { type: 'DateTime', nullable: true }),
    manualCheckin: t.expose('manualCheckin', { type: 'Boolean' }),
    status: t.expose('status', { type: RegistrationStatus }),
    cancellationReason: t.exposeString('cancellationReason', {
      nullable: true,
    }),
    submissions: t.relation('submissions'),
    rating: t.exposeInt('rating', { nullable: true }),
    anonymousRating: t.exposeBoolean('anonymousRating'),
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
