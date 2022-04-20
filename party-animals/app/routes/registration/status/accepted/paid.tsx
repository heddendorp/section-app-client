import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';
import { PaymentStatus, Status } from '~/generated/prisma';

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
  if (registration.paymentStatus !== PaymentStatus.SUCCESS)
    return redirect('/registration/status/accepted');
  return registration;
};

export default function () {
  return (
    <p className="text-green-500">
      You have paid the participation fee. Thank you!
    </p>
  );
}
