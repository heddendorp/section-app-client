import { itemURL } from '~/utils';
import { Form } from '@remix-run/react';
import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { PrismaClient } from '~/generated/prisma';

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (user) {
    const prisma = new PrismaClient();
    const registration = await prisma.registration.findFirst({
      where: {
        id: user.id,
      },
    });
    if (registration) {
      redirect('registration/status');
    }
    return redirect('registration/form');
  }
};

export default function RegistrationLogin() {
  return (
    <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4">
      <img src={itemURL('password:nolan')} className="w-32" />
      <div>
        <p className="mb-6 text-slate-300">
          If you want to sign up for Party Animals you need to create an
          account. <br />
          This will be your account for all things TUMi.
        </p>
        <Form action="/auth/auth0" method="post">
          <button className="inline-block w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
            <span className="block rounded-full bg-slate-800 px-8 py-3 text-sm font-medium hover:bg-transparent">
              Login
            </span>
          </button>
        </Form>
      </div>
    </div>
  );
}
