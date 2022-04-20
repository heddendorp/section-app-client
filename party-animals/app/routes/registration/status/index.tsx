import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';
import { Status } from '~/generated/prisma';

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
  switch (registration.registrationStatus) {
    case Status.PENDING:
      return redirect('/registration/status/pending');
    case Status.ACCEPTED:
      return redirect('/registration/status/accepted');
    case Status.REJECTED:
      return redirect('/registration/status/rejected');
    case Status.CANCELLED:
      return redirect('/registration/status/cancelled');
  }
};
