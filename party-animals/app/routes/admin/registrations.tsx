import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { PrismaClient, Registration, Role, User } from '~/generated/prisma';
import { useLoaderData } from '@remix-run/react';
import { itemURL } from '~/utils';

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
  const countries = fetch(
    'https://restcountries.com/v2/all?fields=name,alpha2Code,flags'
  ).then((res) => res.json());
  const registrations = prisma.registration.findMany({
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  return Promise.all([registrations, countries]);
};

export default function AdminRegistrations() {
  const [registrations, countries] =
    useLoaderData<[(Registration & { user: User })[], any[]]>();
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
        return 'Exchange Student (2nd semester)';
      case 'e':
        return 'Exchange Student (new)';
    }
  };
  const getCountry = (code: string) => {
    return countries.find((c) => c.alpha2Code === code);
  };
  return (
    <main className="grid grid-cols-1 gap-4 text-white md:grid-cols-2">
      {registrations.map((registration) => (
        <div key={registration.id} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center">
            <img
              src={registration.user.photo}
              className="mr-2 w-10 overflow-hidden rounded-full"
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
            <p>signup time</p>
            <p>{registration.createdAt}</p>
            <p>email</p>
            <p>{registration.user.email}</p>
            <p>phone</p>
            <p>{registration.phone}</p>
            <p>county</p>
            <div className="flex items-center">
              <img
                src={getCountry(registration.country).flags.svg}
                className="mr-2 h-4"
                alt=""
              />
              <p>{getCountry(registration.country).name}</p>
            </div>
            <p>university</p>
            <p>{registration.university}</p>
            <p>status</p>
            <p>{mapStatus(registration.status)}</p>
            <p>diet</p>
            <p>{registration.diet}</p>
            <p>Dinner</p>
            <p>{registration.dinner}</p>
            <p>Section</p>
            <p>{registration.esnSection}</p>
            <strong className="col-span-2">Party Animal</strong>
            <p>Size</p>
            <p>{registration.size}</p>
            <p>Oldie</p>
            <p>{registration.oldie ? 'Yes' : 'No'}</p>
            <p>Expectations</p>
            <p>{registration.expectations}</p>
            <p>Requests</p>
            <p>{registration.requests}</p>
          </div>
        </div>
      ))}
    </main>
  );
}
