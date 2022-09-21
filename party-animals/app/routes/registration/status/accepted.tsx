import { LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Registration, Status, User } from '~/generated/prisma';
import { itemURL } from '~/utils';

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
  return registration;
};

export default function () {
  const registration = useLoaderData<Registration & { user: User }>();
  return (
    <section className="bg-slate-800 p-4 text-white md:p-8">
      <div className="mb-8">
        <h2 className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text py-2 text-2xl font-bold leading-loose text-transparent md:col-span-2 md:text-4xl">
          You made it <span className="text-white">🎉 🥳</span>
        </h2>
        <p className="text-xl">
          <span className="font-bold">Welcome to Party Animals!</span> We are so
          excited to take this journey with you!
        </p>
        <h3 className="mt-4 text-2xl font-bold">Next steps</h3>
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4">
          <img src={itemURL('1-circle:nolan')} alt="1st" className="w-24" />
          <div>
            <h4 className="text-lg font-bold">Pay!</h4>
            <p>
              To take part in Party Animals we need you to pay the participation
              fee of 89 euro. If you don't pay, we will give your spot to
              someone on the waitlist.
            </p>
            <Outlet />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4">
          <img src={itemURL('2-circle:nolan')} alt="1st" className="w-24" />
          <div>
            <h4 className="text-lg font-bold">Get to know your group!</h4>
            <p className="mb-4">
              After payment we will invite you to your group chat on whatsapp.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4">
          <img src={itemURL('3-circle:nolan')} alt="1st" className="w-24" />
          <div>
            <h4 className="text-lg font-bold">PARTEY! 👯</h4>
            <p className="mb-4">
              We will get started on the 1st of October and are looking forward
              to meeting you in person. You will get to know your group and
              spend the afternoon and evening with your friends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div
      className="
    mt-6
    flex
    w-full
    items-center
    justify-center
    px-8
  "
    >
      <div className="rounded-md bg-white px-10 py-5 shadow-xl md:py-20 md:px-40">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-blue-600 md:text-9xl">
            Error!
          </h1>

          <h6 className="mb-2 text-center text-lg font-bold text-gray-800 md:text-2xl md:text-3xl">
            <span className="text-red-500">Oops!</span> We had a problem.
          </h6>

          <p className="mb-8 text-center text-gray-500 md:text-lg">
            You can try refreshing the page or contact us at{' '}
            <a href="mailto:questions@esn-tumi.de">questions@esn-tumi.de</a>{' '}
            <br />
            Please send the following error message along with your request:
          </p>

          <pre className="select-all whitespace-pre-wrap text-sm text-slate-600">
            {error.message}
          </pre>
        </div>
      </div>
    </div>
  );
}
