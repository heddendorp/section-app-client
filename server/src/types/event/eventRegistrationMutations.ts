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
import { GraphQLError } from 'graphql';

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
      throw new GraphQLError('Event not found');
    }
    if (event.registrationStart > new Date()) {
      throw new GraphQLError('Registration is not open yet');
    }
    if (context.user?.partyAnimals && event.end < new Date(2022, 4, 10)) {
      throw new GraphQLError('Intercepts with Party Animals');
    }
    const { status } = context.assignment ?? {};
    const allowedStatus =
      registrationType === RegistrationType.PARTICIPANT
        ? event?.participantSignup
        : event?.organizerSignup;
    if (!allowedStatus?.includes(status ?? MembershipStatus.NONE)) {
      throw new GraphQLError(
        'User does not fulfill the requirements to sign up!'
      );
    }
    let registration;
    await context.prisma.$transaction(async (prisma) => {
      const ownRegistration = await prisma.eventRegistration.findFirst({
        where: {
          userId: context.user?.id,
          eventId,
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      if (ownRegistration) {
        throw new Error('You are already registered for this event!');
      }
      const registeredUsers = await prisma.eventRegistration.count({
        where: {
          eventId,
          type: registrationType ?? undefined,
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      const maxRegistrations =
        registrationType === RegistrationType.PARTICIPANT
          ? event?.participantLimit
          : event?.organizerLimit;
      if (registeredUsers >= (maxRegistrations ?? 0)) {
        throw new Error('Event does not have an available spot!');
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
          throw new Error(
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
      } else {
        throw new Error('Registration mode not supported');
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
        const payment = await RegistrationService.createPayment(
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
            payment: { connect: { id: payment.id } },
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
      }
    }
    if (!event) {
      throw new Error('Event not found');
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
        throw new GraphQLError('Only admins can deregister other users');
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
