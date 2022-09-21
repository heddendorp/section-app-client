import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { PaymentStatus, Registration, Status, User } from '~/generated/prisma';
import { authenticator } from '~/services/auth.server';
import { getDomainUrl, getStripeSession } from '~/utils/stripe.server';
import { Form, useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return redirect('/registration');
  const registration = await db.registration.findFirst({
    where: {
      user: {
        id: user.id,
      },
    },
  });
  if (!registration) return redirect('/registration/form');
  if (registration.registrationStatus !== Status.ACCEPTED)
    return redirect('/registration/status');
  if (registration.paymentStatus !== PaymentStatus.PENDING)
    return redirect('/registration/status/accepted');
  return registration;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const registrationId = data.get('registration');
  if (typeof registrationId !== 'string') {
    console.error('Invalid registration id: not string');
    throw new Error('Invalid registration id');
  }
  const registration = await db.registration.findUnique({
    where: {
      id: registrationId,
    },
    include: { user: true },
  });
  if (!registration) {
    console.error('Invalid registration id: not found');
    throw new Error('Invalid registration id');
  }
  if (registration.paymentStatus === PaymentStatus.SUCCESS) {
    console.error('Registration already paid');
    throw new Error('Registration already paid');
  }
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    console.error('Not authenticated');
    throw new Error('Not authenticated');
  }
  const stripeRedirectUrl = await getStripeSession(
    process.env.PRICE_ID as string,
    getDomainUrl(request),
    `Party Animals payment for ${user.email}`,
    {
      registrationId,
      userId: user.id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
    }
  );
  if (!stripeRedirectUrl) {
    console.error('Failed to get stripe session');
    throw new Error('Could not get stripe session');
  }
  return redirect(stripeRedirectUrl);
};

export default function () {
  const registration = useLoaderData<Registration & { user: User }>();
  return (
    <>
      <p className="mb-4 text-red-500">
        You have not paid the participation fee. Please pay now.
      </p>
      <Form method="post">
        <input
          type="hidden"
          defaultValue={registration.id}
          name="registration"
        />
        <button className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
          <span className="block rounded-full bg-slate-800 px-8 py-3 text-sm font-medium hover:bg-transparent">
            Start Payment
          </span>
        </button>
      </Form>
    </>
  );
}
