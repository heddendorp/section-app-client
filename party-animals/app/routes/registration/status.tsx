import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { Prisma, PrismaClient, Registration } from '~/generated/prisma';
import { useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return redirect('/registration');
  const prisma = new PrismaClient();
  const registration = await prisma.registration.findFirst({
    where: {
      user: {
        id: user.id,
      },
    },
  });
  if (!registration) return redirect('/registration/form');
  return registration;
};

export default function RegistrationStatus() {
  const registration = useLoaderData<Registration>();
  return (
    <h2 className="text-2xl font-bold md:col-span-2 md:text-4xl">
      Status: {registration.registrationStatus}
    </h2>
  );
}
