import { builder } from '../../builder';
import prisma from '../../client';
import { GraphQLYogaError } from '@graphql-yoga/node';
import {
  MembershipStatus,
  Prisma,
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  TransactionDirection,
} from '../../generated/prisma';
import { RegistrationService } from '../../helpers/registrationService';
import { DateTime } from 'luxon';

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
      refundFees: t.arg.boolean({ defaultValue: true }),
    },
    resolve: async (
      query,
      parent,
      { registrationId, withRefund, refundFees },
      context,
      info
    ) => {
      let isKick = false;
      const registration = await prisma.eventRegistration.findUniqueOrThrow({
        where: { id: registrationId },
      });
      if (
        registration?.userId !== context.user?.id &&
        context.userOfTenant?.role !== 'ADMIN'
      ) {
        throw new GraphQLYogaError('Only admins can deregister other users');
      }
      const event = await prisma.tumiEvent.findUniqueOrThrow({
        where: { id: registration?.eventId },
      });
      if (
        event.start.getTime() < new Date().getTime() &&
        context.userOfTenant?.role !== 'ADMIN'
      ) {
        throw new GraphQLYogaError(
          'You can not deregister from an event after it has started'
        );
      }
      if (registration?.userId !== context.user?.id) {
        const user = await prisma.user.findUnique({
          where: { id: registration?.userId },
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
      await RegistrationService.cancelRegistration(
        registrationId,
        withRefund ?? false,
        isKick,
        refundFees ?? true,
        context
      );
      return prisma.tumiEvent.findUniqueOrThrow({
        ...query,
        where: { id: event.id },
      });
    },
  }),
  restorePayment: t.prismaField({
    type: 'TumiEvent',
    args: {
      registrationId: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, { registrationId }, context, info) => {
      const registration = await prisma.eventRegistration.findUniqueOrThrow({
        where: { id: registrationId },
        include: {
          event: true,
          user: {
            include: {
              tenants: true,
            },
          },
        },
      });
      const userOfTenant = registration.user.tenants.find(
        (tenant) => tenant.tenantId === context.tenant.id
      );
      const prices = (registration.event.prices ?? { options: [] }) as {
        options: {
          amount: string;
          defaultPrice: boolean;
          esnCardRequired: boolean;
          allowedStatusList: MembershipStatus[];
        }[];
      };
      // sort prices by price
      prices.options.sort(
        (a, b) => parseFloat(a.amount) - parseFloat(b.amount)
      );
      const price = prices.options.find((option) =>
        option.allowedStatusList.includes(
          userOfTenant?.status ?? MembershipStatus.NONE
        )
      );
      if (!price) {
        throw new GraphQLYogaError('No price found for this user');
      }
      const baseUrl =
        process.env.DEV || process.env.NODE_ENV === 'test'
          ? `http://localhost:4200/events/${registration.event.id}`
          : `https://tumi.esn.world/events/${registration.event.id}`;
      const [icon, style] = (registration.event?.icon ?? '').split(':');
      const iconURL = `https://img.icons8.com/${style ?? 'fluency'}/300/${
        icon ?? 'cancel-2'
      }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
      const transaction = await RegistrationService.createPayment(
        context,
        [
          {
            price_data: {
              currency: 'EUR',
              unit_amount: Math.round(parseFloat(price.amount) * 100),
              product_data: {
                name: registration.event.title,
                description: 'Registration fee for event',
                images: [iconURL],
              },
            },
            quantity: 1,
            tax_rates: [process.env['REDUCED_TAX_RATE'] ?? ''],
          },
        ],
        'book',
        `${baseUrl}?cancel=true`,
        `${baseUrl}?success=true`,
        registration.userId,
        false,
        true
      );
      await prisma.eventRegistration.update({
        where: {
          id: registration.id,
        },
        data: {
          transactions: {
            connect: {
              id: transaction.id,
            },
          },
        },
      });
      return prisma.tumiEvent.findUniqueOrThrow({
        ...query,
        where: { id: registration.event.id },
      });
    },
  }),
  cancelPayment: t.prismaField({
    type: 'TumiEvent',
    args: {
      registrationId: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, { registrationId }, context, info) => {
      const registration = await prisma.eventRegistration.findUniqueOrThrow({
        where: { id: registrationId },
        include: {
          event: { select: { registrationMode: true } },
          transactions: {
            where: { direction: TransactionDirection.USER_TO_TUMI },
            include: { stripePayment: true },
          },
        },
      });
      if (registration?.event?.registrationMode === RegistrationMode.STRIPE) {
        await RegistrationService.cancelPayment(registrationId, context);
        await prisma.eventRegistration.update({
          where: { id: registrationId },
          data: { status: RegistrationStatus.CANCELLED },
        });
      }
      return prisma.tumiEvent.findUniqueOrThrow({
        ...query,
        where: { id: registration.eventId },
      });
    },
  }),
  registerForEvent: t.prismaField({
    authScopes: { public: true },
    type: 'TumiEvent',
    args: {
      eventId: t.arg.id({ required: true }),
      registrationType: t.arg({
        type: RegistrationType,
        defaultValue: RegistrationType.PARTICIPANT,
      }),
      submissions: t.arg({ type: 'JSON' }),
      price: t.arg({ type: 'JSON' }),
    },
    resolve: async (
      query,
      parent,
      { registrationType, eventId, submissions, price },
      context,
      info
    ) => {
      const event = await prisma.tumiEvent.findUnique({
        ...query,
        where: { id: eventId },
      });
      if (!event) {
        throw new GraphQLYogaError('Event not found');
      }
      if (registrationType === RegistrationType.ORGANIZER) {
        if (event.organizerRegistrationStart > new Date()) {
          throw new GraphQLYogaError('Registration is not open yet');
        }
      } else {
        if (event.registrationStart > new Date()) {
          throw new GraphQLYogaError('Registration is not open yet');
        }
      }
      const { status } = context.userOfTenant ?? {};
      const allowedStatus =
        registrationType === RegistrationType.PARTICIPANT
          ? event?.participantSignup
          : event?.organizerSignup;
      if (!allowedStatus?.includes(status ?? MembershipStatus.NONE)) {
        throw new GraphQLYogaError(
          'User does not fulfill the requirements to sign up!'
        );
      }
      const ownRegistration = await prisma.eventRegistration.findFirst({
        where: {
          userId: context.user?.id,
          eventId,
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      if (ownRegistration) {
        throw new GraphQLYogaError(
          'You are already registered for this event!'
        );
      }
      const registration = await prisma.$transaction(
        async (prisma) => {
          if (registrationType === RegistrationType.PARTICIPANT) {
            const registrationCount = await prisma.eventRegistration.count({
              where: {
                event: { id: event.id },
                status: { not: RegistrationStatus.CANCELLED },
                type: RegistrationType.PARTICIPANT,
              },
            });
            if (registrationCount > event.participantLimit) {
              throw new GraphQLYogaError(
                'Registration for this event is full!'
              );
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
              throw new GraphQLYogaError(
                'Event does not have an available spot!'
              );
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
          const registrationNumToday = await prisma.eventRegistration.count({
            where: {
              userId: context.user?.id,
              createdAt: {
                gte: DateTime.local().startOf('day').toJSDate(),
              },
              event: { registrationMode: RegistrationMode.STRIPE },
              NOT: {
                event: {
                  title: {
                    contains: 'ESNcard',
                  },
                },
              },
              status: { not: RegistrationStatus.CANCELLED },
            },
          });
          if (registrationNumToday >= 3) {
            throw new GraphQLYogaError(
              'You have reached the maximum number of registrations (3) for today'
            );
          }
          if (
            event?.registrationMode === RegistrationMode.STRIPE &&
            registrationType === RegistrationType.PARTICIPANT
          ) {
            return prisma.eventRegistration.create({
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
            return prisma.eventRegistration.create({
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
            throw new GraphQLYogaError('Registration mode not supported');
          }
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      );
      if (
        event?.registrationMode === RegistrationMode.STRIPE &&
        registrationType === RegistrationType.PARTICIPANT &&
        registration
      ) {
        const baseUrl =
          process.env.DEV || process.env.NODE_ENV === 'test'
            ? `http://localhost:4200/events/${eventId}`
            : `https://tumi.esn.world/events/${eventId}`;
        const [icon, style] = (event?.icon ?? '').split(':');
        const iconURL = `https://img.icons8.com/${style ?? 'fluency'}/300/${
          icon ?? 'cancel-2'
        }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
        try {
          const transaction = await RegistrationService.createPayment(
            context,
            [
              {
                price_data: {
                  currency: 'EUR',
                  unit_amount: Math.round(price.amount * 100),
                  product_data: {
                    name: event.title,
                    description: 'Registration fee for event',
                    images: [iconURL],
                  },
                },
                quantity: 1,
                tax_rates: [process.env['REDUCED_TAX_RATE'] ?? ''],
              },
            ],
            'book',
            `${baseUrl}?cancel=true`,
            `${baseUrl}?success=true`,
            context.user?.id ?? ''
          );
          await prisma.eventRegistration.update({
            where: {
              id: registration.id,
            },
            data: {
              transactions: {
                connect: {
                  id: transaction.id,
                },
              },
            },
          });
        } catch (e) {
          console.log(e);
          await prisma.activityLog.create({
            data: {
              data: JSON.parse(JSON.stringify(e)),
              message: 'Payment creation for registration failed',
              severity: 'ERROR',
              category: 'eventRegistration',
            },
          });
          await prisma.eventRegistration.update({
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
      return event;
    },
  }),
}));
