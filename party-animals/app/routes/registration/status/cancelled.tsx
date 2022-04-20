import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';
import { useLoaderData } from '@remix-run/react';
import { Registration, Status, User } from '~/generated/prisma';

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
  if (registration.registrationStatus !== Status.CANCELLED)
    return redirect('/registration/status');
  return registration;
};

export default function RegistrationStatusCancelled() {
  const registration = useLoaderData<Registration & { user: User }>();
  return (
    <section className="bg-slate-800 p-4 text-white md:p-8">
      <h2 className="mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text py-2 text-2xl font-bold leading-loose text-transparent md:col-span-2 md:text-4xl">
        This is not the year {registration.callBy}
      </h2>
      <p className="mb-4 lg:text-lg">
        We cancelled your registration as per your request. <br />
        If you believe this to be an error, please reach out to{' '}
        <a href="mailto:questions@esn-tumi.de">questions@esn-tumi.de</a> and we
        will help you figure this out. <br />
        If this is what you wanted, make sure to check out the upcoming
        orientation weeks!
      </p>
      <a
        className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[4px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
        href="https://tumi.esn.world/events"
      >
        <span className="block rounded-full bg-slate-800 px-8 py-3 text-center text-lg font-bold hover:bg-transparent">
          Check out the Orientation weeks
        </span>
      </a>
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
