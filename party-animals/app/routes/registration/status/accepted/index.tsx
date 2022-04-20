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
  switch (registration.paymentStatus) {
    case PaymentStatus.PENDING:
      return redirect('/registration/status/accepted/pending');
    case PaymentStatus.SUCCESS:
      return redirect('/registration/status/accepted/paid');
  }
};
