import { DBClient } from './dbClient';
import { Price } from '@tumi/shared/data-types';
import {
  RegistrationMode,
  RegistrationStatus,
  RegistrationType,
} from '@tumi/server-models';
import * as stripe from 'stripe';
import { GetGen } from 'nexus/dist/typegenTypeHelpers';
import { DateTime } from 'luxon';

export class RegistrationService {
  private static prisma = DBClient.getInstance().prisma;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  private static stripe: stripe.Stripe = require('stripe')(
    process.env.STRIPE_KEY
  );

  public static async registerWithCode(
    context: GetGen<'context'>,
    registrationCodeId: string,
    userId: string,
    price?: Price,
    cancelUrl?: string,
    successUrl?: string
  ) {
    const registrationCode = await this.prisma.eventRegistrationCode.findUnique(
      { where: { id: registrationCodeId }, include: { targetEvent: true } }
    );
    if (
      registrationCode.targetEvent.registrationMode === RegistrationMode.STRIPE
    ) {
      const payment = await this.createPayment(
        context,
        [
          {
            amount: price.amount,
            currency: 'EUR',
            name: registrationCode.targetEvent.title,
            description: 'Registration fee for event',
          },
        ],
        'book',
        cancelUrl,
        successUrl,
        userId
      );
      return registrationCode;
    } else if (
      registrationCode.targetEvent.registrationMode === RegistrationMode.ONLINE
    ) {
      const newRegistration = await this.prisma.eventRegistration.create({
        data: {
          user: { connect: { id: userId } },
          event: { connect: { id: registrationCode.eventId } },
          status: RegistrationStatus.SUCCESSFUL,
          type: RegistrationType.PARTICIPANT,
        },
      });
      if (registrationCode.registrationToRemoveId) {
        await this.prisma.eventRegistration.update({
          where: { id: registrationCode.registrationToRemoveId },
          data: {
            status: RegistrationStatus.CANCELLED,
            cancellationReason: `Registration taken over by code`,
          },
        });
      }
      return this.prisma.eventRegistrationCode.update({
        where: { id: registrationCodeId },
        data: {
          status: RegistrationStatus.SUCCESSFUL,
          registrationCreatedId: newRegistration.id,
        },
      });
    }
  }

  private static async createPayment(
    context: GetGen<'context'>,
    items: Array<stripe.Stripe.Checkout.SessionCreateParams.LineItem>,
    submitType: stripe.Stripe.Checkout.SessionCreateParams.SubmitType,
    cancelUrl: string,
    successUrl: string,
    userId: string
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenants: {
          where: { tenantId: context.tenant.id },
          include: { stripeData: true },
        },
      },
    });
    let customerId;
    if (!user.tenants[0].stripeData) {
      const customer = await this.stripe.customers.create({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        metadata: { userId: user.id },
      });
      await this.prisma.stripeUserData.create({
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
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: items,
      payment_method_types: ['card', 'klarna', 'sofort', 'giropay', 'ideal'],
      submit_type: submitType,
      cancel_url: cancelUrl,
      success_url: successUrl,
      expires_at: DateTime.now().plus({ hours: 1 }).toSeconds(),
    });
    const payment = this.prisma.stripePayment.create({
      data: {
        user: { connect: { id: userId } },
        amount: session.amount_total,
        paymentIntent:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id,
        checkoutSession: session.id,
        status: '',
        events: [],
      },
    });
    return payment;
  }
}
