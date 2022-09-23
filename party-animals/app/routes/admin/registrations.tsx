import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import {
  Priority,
  Registration,
  Role,
  User,
  Status,
  Group,
} from '~/generated/prisma';
import { useLoaderData } from '@remix-run/react';
import { itemURL } from '~/utils';
import { db } from '~/utils/db.server';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
    orderBy: { createdAt: 'asc' },
  });
  const groups = db.group.findMany({
    orderBy: { name: 'asc' },
  });
  return Promise.all([registrations, countries, groups]);
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect('/auth/login');
  }
  if (user.role !== Role.ADMIN) {
    throw new Error(
      `Only Admins are allowed to change this! You are ${user.role}`
    );
  }
  const formData = await request.formData();
  const id = formData.get('id');
  if (typeof id !== 'string') {
    throw new Error('No id provided');
  }
  const priority = formData.get('prio');
  const groupId = formData.get('group');
  if (priority) {
    switch (priority) {
      case 'high':
        await db.registration.update({
          where: { id },
          data: { priority: Priority.HIGH },
        });
        break;
      case 'medium':
        await db.registration.update({
          where: { id },
          data: { priority: Priority.MEDIUM },
        });
        break;
      case 'low':
        await db.registration.update({
          where: { id },
          data: { priority: Priority.LOW },
        });
        break;
      case 'cancel':
        await db.registration.update({
          where: { id },
          data: {
            registrationStatus: Status.CANCELLED,
            group: { disconnect: true },
          },
        });
        break;
      case 'pending':
        await db.registration.update({
          where: { id },
          data: {
            registrationStatus: Status.PENDING,
          },
        });
        break;
      case 'none':
        await db.registration.update({
          where: { id },
          data: {
            registrationStatus: Status.REJECTED,
            group: { disconnect: true },
          },
        });
    }
  }
  if (typeof groupId === 'string') {
    if (groupId === 'none') {
      await db.registration.update({
        where: { id },
        data: { group: { disconnect: true } },
      });
    } else {
      await db.registration.update({
        where: { id },
        data: { group: { connect: { id: groupId } } },
      });
    }
  }
  return null;
};

export default function AdminRegistrations() {
  const fetcher = useFetcher();
  const [registrations, countries, groups] =
    useLoaderData<
      [(Registration & { user: User; group?: Group })[], any[], Group[]]
    >();
  const nonRejectedRegistrations = registrations.filter(
    (registration) => registration.status !== 'REJECTED'
  );
  const femaleRegistrations = nonRejectedRegistrations.filter(
    (registration) => registration.gender === 'f'
  );
  const registrationsToday = registrations.filter(
    (registration) =>
      new Date().getDate() === new Date(registration.createdAt).getDate()
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
        return 'Exchange Student (started before october)';
      case 'e':
        return 'Exchange Student (starting in october)';
    }
  };
  const getCountry = (code: string) => {
    return countries.find((c) => c.alpha2Code === code);
  };

  function setPriority(id: string, prio: string) {
    fetcher.submit({ id, prio }, { method: 'patch' });
  }

  function setGroup(id: string, group: string) {
    fetcher.submit({ id, group }, { method: 'patch' });
  }

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
      <section className="grid grid-cols-1 gap-4 p-4 text-white md:grid-cols-2 xl:grid-cols-3">
        {registrations.map((registration) => (
          <div
            key={registration.id}
            className="flex flex-col rounded-lg border p-6"
          >
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
            <div className="mb-4 grid grid-cols-[max-content_auto] gap-2">
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
              <div className="flex items-center">
                <p>{registration.phone}</p>
                <a
                  target="_blank"
                  href={`https://wa.me/${registration.phone.replace(`+`, ``)}`}
                  className="ml-2"
                >
                  <img src={itemURL('whatsapp:fluency')} className="w-6" />
                </a>
              </div>
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
              {registration.esnSection && (
                <>
                  <p>ESN Section</p>
                  <p>{registration.esnSection}</p>
                </>
              )}
              {registration.languages && (
                <>
                  <p>Languages</p>
                  <p>{registration.languages}</p>
                </>
              )}
              <strong className="col-span-2">Party Animal</strong>
              <p>Size</p>
              <p>{registration.size.toUpperCase()}</p>
              <p>Oldie</p>
              <p>{registration.oldie ? 'Yes' : 'No'}</p>
              <p>Expectations</p>
              <p>{registration.expectations}</p>
              {registration.requests && (
                <>
                  <p>Requests</p>
                  <p>{registration.requests}</p>
                </>
              )}
              <strong className="col-span-2">Internal Data</strong>
              <p>Priority</p>
              <p>{registration.priority}</p>
              <p>Status</p>
              <p>{registration.registrationStatus}</p>
              <p>Payment</p>
              <p>{registration.paymentStatus}</p>
              {registration.group && (
                <>
                  <p>Group</p>
                  <p>{registration?.group?.name ?? 'Not assigned'}</p>
                </>
              )}
              {registration.group && registration.paymentStatus === 'PENDING' && (
                <>
                  <p>⚠️Warning⚠️</p>
                  <p>This registration has a group but is not paid.</p>
                </>
              )}
            </div>
            <div className="grow" />
            <Menu as="div" className="relative mb-4 inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  Set Priority
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className=" absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-slate-900 rounded-md bg-slate-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setPriority(registration.id, 'high')}
                        >
                          <img
                            src={itemURL('high-priority:fluency')}
                            className="mr-2 w-6"
                          />
                          High Priority
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setPriority(registration.id, 'medium')}
                        >
                          <img
                            src={itemURL('medium-priority:fluency')}
                            className="mr-2 w-6"
                          />
                          Medium Priority
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setPriority(registration.id, 'low')}
                        >
                          <img
                            src={itemURL('low-priority:fluency')}
                            className="mr-2 w-6"
                          />
                          Low Priority
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() =>
                            setPriority(registration.id, 'pending')
                          }
                        >
                          <img
                            src={itemURL('connection-status-off:fluency')}
                            className="mr-2 w-6"
                          />
                          Set to pending
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setPriority(registration.id, 'cancel')}
                        >
                          <img
                            src={itemURL('cancel:fluency')}
                            className="mr-2 w-6"
                          />
                          Cancel
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setPriority(registration.id, 'none')}
                        >
                          <img
                            src={itemURL('remove-user-female:fluency')}
                            className="mr-2 w-6"
                          />
                          Reject
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  Assign to Group
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-slate-900 rounded-md bg-slate-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {groups.map((group) => (
                      <Menu.Item key={group.id}>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-slate-100'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => setGroup(registration.id, group.id)}
                          >
                            {group.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-slate-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setGroup(registration.id, 'none')}
                        >
                          Remove from group
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ))}
      </section>
    </main>
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
