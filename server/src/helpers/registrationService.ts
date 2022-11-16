// import { Price } from '@tumi/shared/data-types';
import {
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
  Tenant,
  TransactionDirection,
  TransactionType,
  User,
  UsersOfTenants,
} from '../generated/prisma';
import * as stripe from 'stripe';
import { DateTime } from 'luxon';
import prisma from '../client';
import * as Sentry from '@sentry/node';
import { Auth0 } from './auth0';
import * as crypto from 'crypto';

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
      const [icon, style] = (registrationCode.targetEvent?.icon ?? '').split(
        ':'
      );
      const iconURL = `https://img.icons8.com/${style ?? 'fluency'}/300/${
        icon ?? 'cancel-2'
      }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
      const transaction = await this.createPayment(
        context,
        [
          {
            price_data: {
              currency: 'EUR',
              unit_amount: Math.round(price.amount * 100),
              product_data: {
                name: registrationCode.targetEvent.title,
                description: 'Registration fee for event move',
                images: [iconURL],
              },
            },
            quantity: 1,
            tax_rates: [process.env['REDUCED_TAX_RATE'] ?? ''],
          },
        ],
        'book',
        cancelUrl ?? '',
        successUrl ?? '',
        userId,
        registrationCode.sepaAllowed
      );
      await prisma.$transaction(async (prisma) => {
        const registrationCode = await prisma.eventRegistrationCode.findUnique({
          where: { id: registrationCodeId },
          include: { targetEvent: true },
        });
        if (!registrationCode) {
          throw new Error('Registration code not found');
        }
        if (registrationCode.status !== RegistrationStatus.PENDING) {
          throw new Error('Registration code not available anymore');
        }
        const registration = await prisma.eventRegistration.create({
          data: {
            event: { connect: { id: registrationCode.targetEvent.id } },
            user: { connect: { id: userId } },
            transactions: { connect: { id: transaction.id } },
            status: RegistrationStatus.PENDING,
            type: RegistrationType.PARTICIPANT,
            eventRegistrationCode: { connect: { id: registrationCode.id } },
          },
        });
        return prisma.eventRegistrationCode.update({
          where: { id: registrationCodeId },
          data: {
            status: RegistrationStatus.SUCCESSFUL,
            registrationCreatedId: registration.id,
          },
        });
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
      if (registrationCode.registrationToRemoveId) {
        await prisma.eventRegistration.update({
          where: { id: registrationCode.registrationToRemoveId },
          data: {
            status: RegistrationStatus.CANCELLED,
            cancellationReason: `Registration taken over by code`,
          },
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
    allowSepa = false,
    longPaymentTimeout = false
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
    const id = crypto.randomUUID();
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: items,
      payment_method_types,
      payment_intent_data: {
        description: `Fee for: ${items
          .map((item) => item.price_data?.product_data?.name)
          .join(',')}`,
        metadata: {
          stripePaymentId: id,
        },
      },
      submit_type: submitType,
      cancel_url: cancelUrl,
      success_url: successUrl,
      expires_at: Math.round(
        DateTime.now()
          .plus(longPaymentTimeout ? { hours: 23 } : { minutes: 30 })
          .toSeconds()
      ),
      consent_collection: { terms_of_service: 'required' },
    });
    return prisma.transaction.create({
      data: {
        type: TransactionType.STRIPE,
        direction: TransactionDirection.USER_TO_TUMI,
        subject: `Fee for: ${items
          .map((item) => item.price_data?.product_data?.name)
          .join(',')}`,
        createdBy: { connect: { id: userId } },
        user: { connect: { id: userId } },
        tenant: { connect: { id: context.tenant.id } },
        amount: (session.amount_total ?? 0) / 100,
        stripePayment: {
          create: {
            id,
            amount: session.amount_total ?? 0,
            paymentIntent:
              (typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id) ?? undefined,
            checkoutSession: session.id,
            status: 'incomplete',
            events: [
              {
                type: 'session.created',
                name: 'created',
                date: Date.now(),
              },
            ],
          },
        },
      },
    });
  }

  static async cancelPayment(
    registrationId: string,
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
        transactions: {
          where: { direction: TransactionDirection.USER_TO_TUMI },
          include: { stripePayment: true },
        },
      },
    });
    if (!registration) {
      throw new Error('Registration not found');
    }
    if (registration.event.registrationMode === RegistrationMode.STRIPE) {
      const payment = registration.transactions[0]?.stripePayment;
      if (!payment) {
        throw new Error('Payment not found');
      }
      try {
        await this.stripe.checkout.sessions.expire(payment.checkoutSession);
      } catch (e) {
        console.error(e);
        Sentry.captureException(e);
      }
    }
  }

  static async cancelRegistration(
    registrationId: string,
    withRefund: boolean,
    isKick: boolean,
    refundFees: boolean,
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
        transactions: {
          where: { direction: TransactionDirection.USER_TO_TUMI },
          include: { stripePayment: true },
        },
      },
    });
    if (!registration) {
      throw new Error('Registration not found');
    }
    if (registration.event.registrationMode === RegistrationMode.STRIPE) {
      if (withRefund) {
        const payment = registration.transactions[0]?.stripePayment;
        if (!payment || !payment.paymentIntent) {
          throw new Error('Payment not found');
        }
        console.log(payment.netAmount?.toNumber());
        try {
          await this.stripe.refunds.create({
            payment_intent: payment.paymentIntent,
            ...(refundFees ? {} : { amount: payment.netAmount?.toNumber() }),
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
    } else {
      throw new Error('Registration mode not supported');
    }
    return registration.event;
  }
}
