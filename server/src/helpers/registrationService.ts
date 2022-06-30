// import { Price } from '@tumi/shared/data-types';
import {
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  Tenant,
  TransactionType,
  User,
  UsersOfTenants,
} from '../generated/prisma';
import * as stripe from 'stripe';
import { DateTime } from 'luxon';
import prisma from '../client';
import * as Sentry from '@sentry/node';
import { Auth0 } from './auth0';

export class RegistrationService {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  private static stripe: stripe.Stripe = require('stripe')(
    process.env['STRIPE_KEY']
  );

  public static async registerWithCode(
    context: {
      token?: { sub: string };
      auth0: Auth0;
      tenant: Tenant;
      user?: User;
      userOfTenant?: UsersOfTenants;
    },
    registrationCodeId: string,
    userId: string,
    price: any,
    cancelUrl?: string,
    successUrl?: string
  ): Promise<any> {
    const registrationCode = await prisma.eventRegistrationCode.findUnique({
      where: { id: registrationCodeId },
      include: { targetEvent: true },
    });
    if (
      registrationCode?.targetEvent?.registrationMode ===
      RegistrationMode.STRIPE
    ) {
      const transaction = await this.createPayment(
        context,
        [
          {
            amount: price.amount * 100,
            currency: 'EUR',
            quantity: 1,
            name: registrationCode.targetEvent.title,
            tax_rates: ['txr_1KFJcK4EBOHRwndErPETnHSR'],
            description: 'Registration code fee for event',
          },
        ],
        'book',
        cancelUrl ?? '',
        successUrl ?? '',
        userId,
        registrationCode.sepaAllowed
      );
      const registration = await prisma.eventRegistration.create({
        data: {
          event: { connect: { id: registrationCode.targetEvent.id } },
          user: { connect: { id: userId } },
          transaction: { connect: { id: transaction.id } },
          status: RegistrationStatus.PENDING,
          type: RegistrationType.PARTICIPANT,
          eventRegistrationCode: { connect: { id: registrationCode.id } },
        },
      });
      await prisma.tumiEvent.update({
        where: { id: registrationCode.eventId },
        data: { participantRegistrationCount: { increment: 1 } },
      });
      return prisma.eventRegistrationCode.update({
        where: { id: registrationCodeId },
        data: {
          registrationCreatedId: registration.id,
          transactionId: transaction.id,
        },
      });
    } else if (
      registrationCode?.targetEvent?.registrationMode ===
      RegistrationMode.ONLINE
    ) {
      const newRegistration = await prisma.eventRegistration.create({
        data: {
          user: { connect: { id: userId } },
          event: { connect: { id: registrationCode.eventId } },
          status: RegistrationStatus.SUCCESSFUL,
          type: RegistrationType.PARTICIPANT,
        },
      });
      await prisma.tumiEvent.update({
        where: { id: registrationCode.eventId },
        data: { participantRegistrationCount: { increment: 1 } },
      });
      if (registrationCode.registrationToRemoveId) {
        await prisma.eventRegistration.update({
          where: { id: registrationCode.registrationToRemoveId },
          data: {
            status: RegistrationStatus.CANCELLED,
            cancellationReason: `Registration taken over by code`,
          },
        });
        await prisma.tumiEvent.update({
          where: { id: registrationCode.eventId },
          data: { participantRegistrationCount: { decrement: 1 } },
        });
      }
      return prisma.eventRegistrationCode.update({
        where: { id: registrationCodeId },
        data: {
          status: RegistrationStatus.SUCCESSFUL,
          registrationCreatedId: newRegistration.id,
        },
      });
    }
  }

  public static async createPayment(
    context: {
      token?: { sub: string };
      auth0: Auth0;
      tenant: Tenant;
      user?: User;
      userOfTenant?: UsersOfTenants;
    },
    items: Array<stripe.Stripe.Checkout.SessionCreateParams.LineItem>,
    submitType: stripe.Stripe.Checkout.SessionCreateParams.SubmitType,
    cancelUrl: string,
    successUrl: string,
    userId: string,
    allowSepa = false
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenants: {
          where: { tenantId: context.tenant.id },
          include: { stripeData: true },
        },
      },
    });
    let customerId;
    // TODO: Check all ?. uses
    if (!user?.tenants[0].stripeData) {
      const customer = await this.stripe.customers.create({
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        metadata: { userId: user?.id ?? '', tenantId: context.tenant.id },
      });
      await prisma.stripeUserData.create({
        data: {
          usersOfTenantsTenantId: context.tenant.id,
          usersOfTenantsUserId: userId,
          customerId: customer.id,
        },
      });
      customerId = customer.id;
    } else {
      customerId = user.tenants[0].stripeData.customerId;
    }
    const payment_method_types: stripe.Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
      [
        'card',
        // 'sofort',
        'giropay',
        'ideal',
        'p24',
        'bancontact',
      ];
    if (allowSepa) {
      payment_method_types.push('sepa_debit');
    }
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: items,
      payment_method_types,
      payment_intent_data: {
        description: `Fee for: ${items.map((item) => item.name).join(',')}`,
      },
      submit_type: submitType,
      cancel_url: cancelUrl,
      success_url: successUrl,
      expires_at: Math.round(DateTime.now().plus({ hours: 1 }).toSeconds()),
    });
    return prisma.transaction.create({
      data: {
        type: TransactionType.STRIPE,
        subject: `Fee for: ${items.map((item) => item.name).join(',')}`,
        createdBy: { connect: { id: userId } },
        user: { connect: { id: userId } },
        tenant: { connect: { id: context.tenant.id } },
        amount: (session.amount_total ?? 0) / -100,
        stripePayment: {
          create: {
            amount: session.amount_total ?? 0,
            paymentIntent:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id || '',
            checkoutSession: session.id,
            status: 'incomplete',
            events: [
              {
                type: 'payment_intent.created',
                name: 'created',
                date: Date.now(),
              },
            ],
          },
        },
      },
    });
  }

  static async cancelRegistration(
    registrationId: string,
    withRefund: boolean,
    isKick: boolean,
    context: {
      token?: { sub: string };
      auth0: Auth0;
      tenant: Tenant;
      user?: User;
      userOfTenant?: UsersOfTenants;
    }
  ) {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        transaction: { include: { stripePayment: true } },
      },
    });
    if (!registration) {
      throw new Error('Registration not found');
    }
    if (registration.event.registrationMode === RegistrationMode.STRIPE) {
      if (withRefund) {
        const payment = registration.transaction?.stripePayment;
        if (!payment) {
          throw new Error('Payment not found');
        }
        try {
          await this.stripe.refunds.create({
            payment_intent: payment.paymentIntent,
          });
        } catch (e) {
          console.error(e);
          Sentry.captureException(e);
        }
      }
      await prisma.eventRegistration.update({
        where: { id: registrationId },
        data: {
          status: RegistrationStatus.CANCELLED,
          cancellationReason: isKick
            ? 'Cancelled by admin'
            : 'Spot given up by user',
        },
      });
      if (registration.type === RegistrationType.PARTICIPANT) {
        await prisma.tumiEvent.update({
          where: { id: registration.eventId },
          data: { participantRegistrationCount: { decrement: 1 } },
        });
      }
    } else if (
      registration.event.registrationMode === RegistrationMode.ONLINE
    ) {
      await prisma.eventRegistration.update({
        where: { id: registrationId },
        data: {
          status: RegistrationStatus.CANCELLED,
          cancellationReason: isKick
            ? 'Cancelled by admin'
            : 'Spot given up by user',
        },
      });
      if (registration.type === RegistrationType.PARTICIPANT) {
        await prisma.tumiEvent.update({
          where: { id: registration.eventId },
          data: { participantRegistrationCount: { decrement: 1 } },
        });
      }
    } else {
      throw new Error('Registration mode not supported');
    }
    return registration.event;
  }
}
