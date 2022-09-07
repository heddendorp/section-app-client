import { LoaderFunction, redirect } from '@remix-run/node';
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
  if (registration.registrationStatus !== Status.PENDING)
    return redirect('/registration/status');
  return registration;
};

export default function RegistrationStatusPending() {
  const registration = useLoaderData<Registration & { user: User }>();
  return (
    <section className="bg-slate-800 p-4 text-white md:p-8">
      <h2 className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text py-2 text-2xl font-bold leading-loose text-transparent md:col-span-2 md:text-4xl">
        Hey there {registration.callBy}! <span className="text-white">👋</span>{' '}
        <br />
        You registered for Party Animals!
      </h2>
      <p className="lg:text-lg">
        You have signed up successfully. We will reach out during the admission
        rounds if we where able to find a place for you.
      </p>
      <p className="lg:text-lg">
        In case anything changes for you please reach out to us via{' '}
        <a
          href="mailto:questions@esn-tumi.de?subject=[Party Animals] "
          target="_blank"
        >
          questions@esn-tumi.de
        </a>{' '}
        and inform us about your current situation.
      </p>
      <p className="mt-2 lg:text-lg">
        The rounds of admission are: <br />
        <ul className="list-inside list-disc">
          <li>the 23rd of september</li>
          <li>the 25th of september</li>
        </ul>
        Check your mail or this page to see if you got a spot.
      </p>
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
