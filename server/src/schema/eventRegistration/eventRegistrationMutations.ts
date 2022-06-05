import { builder } from '../../builder';
import prisma from '../../client';
import { GraphQLYogaError } from '@graphql-yoga/node';
import { RegistrationType } from '../../generated/prisma';
import { RegistrationService } from '../../helpers/registrationService';

builder.mutationFields((t) => ({
  checkInUser: t.prismaField({
    authScopes: { member: true },
    type: 'EventRegistration',
    args: {
      registrationId: t.arg.id({ required: true }),
      manualCheckin: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.eventRegistration.update({
        ...query,
        where: {
          id: args.registrationId,
        },
        data: {
          manualCheckin: args.manualCheckin ?? false,
          checkInTime: new Date(),
        },
      });
    },
  }),
  deregisterFromEvent: t.prismaField({
    authScopes: { public: true },
    type: 'TumiEvent',
    args: {
      registrationId: t.arg.id({ required: true }),
      withRefund: t.arg.boolean({ defaultValue: true }),
    },
    resolve: async (
      query,
      parent,
      { registrationId, withRefund },
      context,
      info
    ) => {
      let isKick = false;
      const registration = await prisma.eventRegistration.findUnique({
        where: { id: registrationId },
      });
      if (
        registration?.userId !== context.user?.id &&
        context.userOfTenant?.role !== 'ADMIN'
      ) {
        throw new GraphQLYogaError('Only admins can deregister other users');
      }
      if (registration?.userId !== context.user?.id) {
        const user = await prisma.user.findUnique({
          where: { id: registration?.userId },
        });
        const event = await prisma.tumiEvent.findUnique({
          where: { id: registration?.eventId },
        });
        isKick = true;
        await prisma.activityLog.create({
          data: {
            severity: 'INFO',
            category: 'event-kick',
            message: `${
              registration?.type === RegistrationType.PARTICIPANT
                ? 'Participant'
                : 'Organizer'
            } was removed ${withRefund ? 'with' : 'without'} refund by ${
              context.user?.firstName
            } ${context.user?.lastName}`,
            data: JSON.parse(JSON.stringify(registration)),
            oldData: {
              user: JSON.parse(JSON.stringify(user)),
              event: JSON.parse(JSON.stringify(event)),
            },
          },
        });
      }
      return RegistrationService.cancelRegistration(
        registrationId,
        withRefund ?? false,
        isKick,
        context
      );
    },
  }),
}));
