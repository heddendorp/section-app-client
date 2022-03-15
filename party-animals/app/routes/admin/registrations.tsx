import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { Registration, Role, User } from '~/generated/prisma';
import { useLoaderData } from '@remix-run/react';
import { itemURL } from '~/utils';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect('/auth/login');
  }
  if (user.role !== Role.ADMIN) {
    console.log(user);
    throw new Error('You are not authorized to view this page');
  }
  const countries = fetch(
    'https://restcountries.com/v2/all?fields=name,alpha2Code,flags'
  ).then((res) => res.json());
  const registrations = db.registration.findMany({
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  return Promise.all([registrations, countries]);
};

export default function AdminRegistrations() {
  const [registrations, countries] =
    useLoaderData<[(Registration & { user: User })[], any[]]>();
  const nonRejectedRegistrations = registrations.filter(
    (registration) => registration.status !== 'REJECTED'
  );
  const femaleRegistrations = nonRejectedRegistrations.filter(
    (registration) => registration.gender === 'f'
  );
  const registrationsToday = registrations.filter(
    (registration) =>
      new Date().getDay() === new Date(registration.createdAt).getDay()
  );
  const mapGender = (short: string) => {
    switch (short) {
      case 'm':
        return 'male';
      case 'f':
        return 'female';
      case 'd':
        return 'genderqueer';
      case 'n':
        return 'question-mark';
    }
  };
  const mapStatus = (short: string) => {
    switch (short) {
      case 'l':
        return 'Local Student';
      case 'i':
        return 'International degree student';
      case 'o':
        return 'Exchange Student (arrived in 2021)';
      case 'e':
        return 'Exchange Student (arrived in 2022)';
    }
  };
  const getCountry = (code: string) => {
    return countries.find((c) => c.alpha2Code === code);
  };
  return (
    <main>
      <section className="mb-2 p-4 text-white">
        <h1 className="text-2xl font-bold">Registrations</h1>
      </section>
      <section className="p-4 text-white sm:p-0">
        <ul className="divide-y-2 divide-white divide-opacity-25 border-2 border-white border-opacity-25 sm:grid sm:grid-cols-3 sm:divide-y-0 sm:divide-x-2 sm:border-l-0 sm:border-r-0 ">
          <li className="p-8">
            <p className="text-3xl font-black">
              {nonRejectedRegistrations.length}
            </p>
            <p className="mt-1 text-xl font-medium">Registrations</p>
          </li>

          <li className="p-8">
            <p className="text-3xl font-black">{femaleRegistrations.length}</p>
            <p className="mt-1 text-xl font-medium">Female registrations</p>
          </li>

          <li className="p-8">
            <p className="text-3xl font-black">{registrationsToday.length}</p>
            <p className="mt-1 text-xl font-medium">Created today</p>
          </li>
        </ul>
      </section>
      <section className="grid grid-cols-1 gap-4 p-4 text-white lg:grid-cols-2 xl:grid-cols-3">
        {registrations.map((registration) => (
          <div key={registration.id} className="rounded-lg border p-6">
            <div className="mb-4 flex items-center">
              <img
                src={registration.user.photo}
                className="mr-2 w-10 overflow-hidden rounded-full"
                referrerPolicy={'no-referrer'}
              />
              <h2 className="text-xl font-bold">
                Registration of {registration.user.firstName}{' '}
                {registration.user.lastName} ({registration.callBy})
              </h2>
              <div className="grow" />
              <img
                src={itemURL(`${mapGender(registration.gender)}:color`)}
                className="w-10"
              />
            </div>
            <div className="grid grid-cols-[max-content_auto] gap-2">
              <p>Registration Time</p>
              <p>
                {new Date(registration.createdAt).toLocaleString('en-DE', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
              <p>E-Mail</p>
              <p>{registration.user.email}</p>
              <p>Phone Number</p>
              <p>{registration.phone}</p>
              <p>Home Country</p>
              <div className="flex items-center">
                <img
                  src={getCountry(registration.country).flags.svg}
                  className="mr-2 h-4"
                  alt=""
                />
                <p>{getCountry(registration.country).name}</p>
              </div>
              <p>Home University</p>
              <p>{registration.university}</p>
              <p>Status</p>
              <p>{mapStatus(registration.status)}</p>
              <p>Diet</p>
              <p>{registration.diet}</p>
              <p>Dinner choice</p>
              <p>{registration.dinner}</p>
              <p>Section</p>
              <p>{registration.esnSection}</p>
              <strong className="col-span-2">Party Animal</strong>
              <p>Size</p>
              <p>{registration.size.toUpperCase()}</p>
              <p>Oldie</p>
              <p>{registration.oldie ? 'Yes' : 'No'}</p>
              <p>Expectations</p>
              <p>{registration.expectations}</p>
              <p>Requests</p>
              <p>{registration.requests}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
