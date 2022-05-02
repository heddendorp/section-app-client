import { arg, booleanArg, idArg, mutationField, nonNull } from 'nexus';
import { eventType } from './eventType';
import {
  MembershipStatus,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
} from '../../generated/prisma';
import { RegistrationService } from '../../helpers/registrationService';
import { registrationTypeEnum } from '../enums';
import { GraphQLYogaError } from '@graphql-yoga/node';
import prisma from '../../client';

export const registerForEventMutation = mutationField('registerForEvent', {
  type: nonNull(eventType),
  args: {
    registrationType: arg({
      type: registrationTypeEnum,
      default: RegistrationType.PARTICIPANT,
    }),
    submissions: arg({ type: 'Json' }),
    price: arg({ type: 'Json' }),
    eventId: nonNull(idArg()),
  },
  resolve: async (
    source,
    { registrationType, eventId, submissions, price },
    context
  ) => {
    const event = await context.prisma.tumiEvent.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new GraphQLYogaError('Event not found');
    }
    if (event.registrationStart > new Date()) {
      throw new GraphQLYogaError('Registration is not open yet');
    }
    const { status } = context.assignment ?? {};
    const allowedStatus =
      registrationType === RegistrationType.PARTICIPANT
        ? event?.participantSignup
        : event?.organizerSignup;
    if (!allowedStatus?.includes(status ?? MembershipStatus.NONE)) {
      throw new GraphQLYogaError(
        'User does not fulfill the requirements to sign up!'
      );
    }
    const ownRegistration = await context.prisma.eventRegistration.findFirst({
      where: {
        userId: context.user?.id,
        eventId,
        status: { not: RegistrationStatus.CANCELLED },
      },
    });
    if (ownRegistration) {
      throw new GraphQLYogaError('You are already registered for this event!');
    }
    let registration;
    await context.prisma.$transaction(async (prisma) => {
      if (registrationType === RegistrationType.PARTICIPANT) {
        const registrationCountEvent = await prisma.tumiEvent.findUnique({
          where: { id: eventId },
          select: { participantRegistrationCount: true },
        });
        if (
          (registrationCountEvent?.participantRegistrationCount ?? 0) >=
          event.participantLimit
        ) {
          throw new GraphQLYogaError('Registration for this event is full!');
        }
      } else {
        const registeredUsers = await prisma.eventRegistration.count({
          where: {
            eventId,
            type: registrationType ?? undefined,
            status: { not: RegistrationStatus.CANCELLED },
          },
        });
        if (registeredUsers >= event.organizerLimit) {
          throw new GraphQLYogaError('Event does not have an available spot!');
        }
      }
      const submissionArray: { submissionItem: any; data: any }[] = [];
      if (submissions) {
        Object.entries(submissions).forEach(([key, value]) => {
          submissionArray.push({
            submissionItem: { connect: { id: key } },
            data: { value },
          });
        });
      }
      if (
        event.organizerLimit > 1 &&
        registrationType === RegistrationType.ORGANIZER
      ) {
        const userIsNewbie =
          context.user?.createdAt &&
          context.user?.createdAt > new Date(2022, 1, 1);
        const sameStatusRegistrations = await prisma.eventRegistration.count({
          where: {
            eventId,
            type: RegistrationType.ORGANIZER,
            status: { not: RegistrationStatus.CANCELLED },
            user: {
              createdAt: userIsNewbie
                ? { gte: new Date(2022, 1, 1) }
                : { lte: new Date(2022, 1, 1) },
            },
          },
        });
        if (event.organizerLimit - 1 - sameStatusRegistrations <= 0) {
          throw new GraphQLYogaError(
            `Event does not have an organizer spot for ${
              userIsNewbie ? 'newbies' : 'oldies'
            }!`
          );
        }
      }
      if (
        event?.registrationMode === RegistrationMode.STRIPE &&
        registrationType === RegistrationType.PARTICIPANT
      ) {
        registration = await prisma.eventRegistration.create({
          data: {
            user: { connect: { id: context.user?.id } },
            event: { connect: { id: eventId } },
            status: RegistrationStatus.PENDING,
            type: registrationType,
            // payment: { connect: { id: payment.id } },
            submissions: {
              create: submissionArray,
            },
          },
        });
        await prisma.tumiEvent.update({
          where: { id: eventId },
          data: { participantRegistrationCount: { increment: 1 } },
        });
      } else if (
        event?.registrationMode === RegistrationMode.ONLINE ||
        registrationType === RegistrationType.ORGANIZER
      ) {
        await prisma.eventRegistration.create({
          data: {
            user: { connect: { id: context.user?.id } },
            event: { connect: { id: eventId } },
            status: RegistrationStatus.SUCCESSFUL,
            type: registrationType ?? undefined,
            submissions: {
              create: submissionArray,
            },
          },
        });
        if (registrationType === RegistrationType.PARTICIPANT) {
          await prisma.tumiEvent.update({
            where: { id: eventId },
            data: { participantRegistrationCount: { increment: 1 } },
          });
        }
      } else {
        throw new GraphQLYogaError('Registration mode not supported');
      }
    });
    if (
      event?.registrationMode === RegistrationMode.STRIPE &&
      registrationType === RegistrationType.PARTICIPANT &&
      registration
    ) {
      const baseUrl = process.env.DEV
        ? `http://localhost:4200/events/${eventId}`
        : `https://tumi.esn.world/events/${eventId}`;
      try {
        const transaction = await RegistrationService.createPayment(
          context,
          [
            {
              amount: price.amount * 100,
              quantity: 1,
              currency: 'EUR',
              name: event.title,
              description: 'Registration fee for event',
              tax_rates: ['txr_1KFJcK4EBOHRwndErPETnHSR'],
            },
          ],
          'book',
          `${baseUrl}?cancel=true`,
          `${baseUrl}?success=true`,
          context.user?.id ?? ''
        );
        await context.prisma.eventRegistration.update({
          where: {
            id: registration.id,
          },
          data: {
            transaction: {
              connect: {
                id: transaction.id,
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
        await context.prisma.eventRegistration.update({
          where: {
            id: registration.id,
          },
          data: {
            status: RegistrationStatus.CANCELLED,
            cancellationReason: 'Payment creation failed',
          },
        });
        await prisma.tumiEvent.update({
          where: { id: eventId },
          data: { participantRegistrationCount: { decrement: 1 } },
        });
      }
    }
    if (!event) {
      throw new GraphQLYogaError('Event not found');
    }
    return event;
  },
});

export const deregisterFromEventMutation = mutationField(
  'deregisterFromEvent',
  {
    args: {
      registrationId: nonNull(idArg()),
      withRefund: booleanArg({ default: true }),
    },
    type: eventType,
    resolve: async (source, { registrationId, withRefund }, context) => {
      let isKick = false;
      const registration = await context.prisma.eventRegistration.findUnique({
        where: { id: registrationId },
      });
      if (
        registration?.userId !== context.user?.id &&
        context.assignment?.role !== 'ADMIN'
      ) {
        throw new GraphQLYogaError('Only admins can deregister other users');
      }
      if (registration?.userId !== context.user?.id) {
        const user = await context.prisma.user.findUnique({
          where: { id: registration?.userId },
        });
        const event = await context.prisma.tumiEvent.findUnique({
          where: { id: registration?.eventId },
        });
        isKick = true;
        await context.prisma.activityLog.create({
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
  }
);
