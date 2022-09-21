import Stripe from 'stripe';

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export const getStripeSession = async (
  priceId: string,
  domainUrl: string,
  description: string,
  metadata: Stripe.MetadataParam
): Promise<string | null> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-08-01',
  });
  const lineItems = [
    {
      price: priceId,
      quantity: 1,
      tax_rates: ['txr_1KFJcK4EBOHRwndErPETnHSR'],
    },
  ];
  const payment_method_types: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    ['card', 'giropay', 'ideal', 'p24', 'bancontact'];
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types,
    line_items: lineItems,
    success_url: `${domainUrl}/registration/status`,
    cancel_url: `${domainUrl}/payment/cancelled`,
    payment_intent_data: {
      description,
      metadata,
    },
    metadata,
  });
  return session.url;
};
