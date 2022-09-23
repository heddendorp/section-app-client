import { LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { Group, Registration, Role, User } from '~/generated/prisma';
import { db } from '~/utils/db.server';
import { useLoaderData, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect('/auth/login');
  }
  if (user.role !== Role.ADMIN) {
    throw new Error('You are not authorized to view this page');
  }
  const countries = fetch(
    'https://restcountries.com/v2/all?fields=name,alpha2Code,flags'
  ).then((res) => res.json());
  const registrations = db.registration.findMany({
    include: { user: true, group: true },
    orderBy: [{ group: { name: 'asc' } }, { user: { lastName: 'asc' } }],
  });
  const groups = db.group.findMany({
    orderBy: { name: 'asc' },
  });
  return Promise.all([registrations, countries, groups]);
};

const mapRegistrationDate = (
  registration: any
): Registration & { user: User; group?: Group } => ({
  ...registration,
  createdAt: new Date(registration.createdAt),
  user: {
    ...registration.user,
    createdAt: new Date(registration.user.createdAt),
  },
  group: registration.group
    ? {
        ...registration.group,
        createdAt: new Date(registration.group.createdAt),
      }
    : undefined,
});

export default function () {
  // parse query params
  const query = new URLSearchParams(useLocation().search);
  const [registrations, countries, groups] =
    useLoaderData<
      [(Registration & { user: User; group?: Group })[], any[], Group[]]
    >();
  // selected registrationStatus
  const [registrationStatus, setRegistrationStatus] = useState<string>(
    query.get('registrationStatus') || ''
  );
  // selected group
  const [group, setGroup] = useState<string>(query.get('group') || '');
  // selected paymentStatus
  const [paymentStatus, setPaymentStatus] = useState<string>(
    query.get('paymentStatus') || ''
  );
  // filtered registrations
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    (Registration & { user: User; group?: Group })[]
  >(registrations.map(mapRegistrationDate));

  // deadline date
  const [deadlineDate, setDeadlineDate] = useState<string>(
    new Date(new Date().setUTCHours(18, 0, 0)).toLocaleString('de-DE')
  );

  useEffect(() => {
    const filterObject = {
      registrationStatus,
      group,
      paymentStatus,
    };
    // set query params
    const queryParams = new URLSearchParams(filterObject);
    window.history.replaceState({}, '', `?${queryParams}`);
    setFilteredRegistrations(
      registrations.map(mapRegistrationDate).filter((registration) => {
        if (
          registrationStatus &&
          registration.registrationStatus !== registrationStatus
        ) {
          return false;
        }
        if (group && registration?.group?.id !== group) {
          return false;
        }
        return !(paymentStatus && registration.paymentStatus !== paymentStatus);
      })
    );
  }, [registrationStatus, group, paymentStatus, registrations]);

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
  const generateWaLink = (
    registration: Registration & { user: User; group?: Group }
  ) => {
    const number = registration.phone.replace(/[ +]/g, '');
    const message = encodeURIComponent(`Hey there ${registration.callBy}!
It seems like we didn't get your payment for your the party animals spot yet. Please pay your registration fee at the following link:
https://party-animals.esn.world/registration/status 
This is also where you can see your registration status, if the payment is confirmed here you are good to go.
The *payment deadline is ${deadlineDate} CET* if you do not pay or contact us we will cancel your spot.
Should you not be able to take part in the program anymore, please contact us at questions@esn-tumi.de and we will cancel your spot.
Best, 
Your TUMi party animals team`);
    return `https://wa.me/${number}?text=${message}`;
  };
  return (
    <main>
      <section className="mb-2 p-4 text-white">
        <h1 className="mb-2 text-2xl font-bold">Registration Status Board</h1>
        <p className="mb-4">This is for sending mails and stuff</p>
        <div className="space-x-4 md:flex">
          <label
            className="relative block w-32 rounded-lg border-2 border-gray-200 p-3"
            htmlFor="status"
          >
            <select
              id="status"
              onChange={(event) => setRegistrationStatus(event.target.value)}
              className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
              defaultValue={registrationStatus}
            >
              <option value="">All</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
              Status
            </span>
          </label>
          <label
            className="relative block rounded-lg border-2 border-gray-200 p-3"
            htmlFor="group"
          >
            <select
              id="group"
              onChange={(event) => setGroup(event.target.value)}
              className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
              defaultValue={group}
            >
              <option value="">All</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
              Group
            </span>
          </label>
          <label
            className="relative block w-32 rounded-lg border-2 border-gray-200 p-3"
            htmlFor="paymentStatus"
          >
            <select
              id="paymentStatus"
              onChange={(event) => setPaymentStatus(event.target.value)}
              className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
              defaultValue={paymentStatus}
            >
              <option value="">All</option>
              <option value="PENDING">pending</option>
              <option value="SUCCESS">paid</option>
            </select>
            <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
              Payment Status
            </span>
          </label>
          <label
            htmlFor="deadLineDate"
            className="relative block w-40 rounded-lg border-2 border-gray-200 p-3"
          >
            <input
              type="tex"
              onChange={(event) => setDeadlineDate(event.target.value)}
              className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
              defaultValue={deadlineDate}
            />
            <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
              Deadline Date
            </span>
          </label>
        </div>
      </section>
      <section className="mb-2 p-4 text-white">
        <h2 className="mb-4 text-lg font-bold">
          Selected registrations ({filteredRegistrations.length})
        </h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Group</th>
              <th className="px-4 py-2">Registration Status</th>
              <th className="px-4 py-2">Payment status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id}>
                <td className="px-4 py-2">{registration.user.firstName}</td>
                <td className="px-4 py-2">{registration.user.lastName}</td>
                <td className="px-4 py-2">{registration.user.email}</td>
                <td className="px-4 py-2">{registration.phone}</td>
                <td className="px-4 py-2">{registration.group?.name}</td>
                <td className="px-4 py-2">{registration.registrationStatus}</td>
                <td className="px-4 py-2">{registration.paymentStatus}</td>
                <td className="px-4 py-2">
                  <a
                    className="rounded bg-gray-800 py-2 px-4 font-bold text-white hover:bg-gray-700"
                    href={generateWaLink(registration)}
                    target="_blank"
                  >
                    Send WA message
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mb-2 p-4 text-white">
        <h2 className="mb-4 text-lg font-bold">
          All those mails ({filteredRegistrations.length})
        </h2>
        <pre className="select-all whitespace-pre-wrap break-words">
          {filteredRegistrations.map((r) => r.user.email).join(';')}
        </pre>
      </section>
      <section className="mb-2 p-4 text-white">
        <h2 className="mb-4 text-lg font-bold">
          All those ids ({filteredRegistrations.length})
        </h2>
        <pre className="select-all whitespace-pre-wrap break-words">
          {filteredRegistrations.map((r) => `'${r.user.authId}'`).join(',')}
        </pre>
      </section>
    </main>
  );
}
