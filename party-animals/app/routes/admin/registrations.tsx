import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { PrismaClient, Registration, Role, User } from '~/generated/prisma';
import { useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect('/auth/login');
  }
  if (user.role !== Role.ADMIN) {
    console.log(user);
    throw new Error('You are not authorized to view this page');
  }
  const prisma = new PrismaClient();
  return prisma.registration.findMany({ include: { user: true } });
};

export default function AdminRegistrations() {
  const registrations = useLoaderData<(Registration & { user: User })[]>();
  console.log(registrations);
  return (
    <main className="text-white">
      {registrations.map((registration) => (
        <div key={registration.id}>
          <span>{registration.user.firstName}</span>
        </div>
      ))}
    </main>
  );
}
