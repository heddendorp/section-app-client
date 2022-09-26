import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import {
  Group,
  Priority,
  Registration,
  Role,
  Status,
  User,
} from '~/generated/prisma';
import { db } from '~/utils/db.server';
import { Form, useLoaderData } from '@remix-run/react';
import { itemURL } from '~/utils';
import { Popover } from '@headlessui/react';

const prioToNum = (prio: Priority) => {
  switch (prio) {
    case Priority.LOW:
      return 1;
    case Priority.MEDIUM:
      return 2;
    case Priority.HIGH:
      return 3;
    default:
      return 2;
  }
};

const statusToNum = (status: string) => {
  switch (status) {
    case 'l':
      return 1;
    case 'i':
      return 2;
    case 'o':
      return 3;
    case 'e':
      return 3;
    default:
      return 0;
  }
};

const shirtSizeInGroup = (group: Registration[], size: string) => {
  return group.filter((reg) => reg.size === size).length;
};

const spaceForSizeInGroup = (group: Registration[], size: string) => {
  const alreadyInGroup = shirtSizeInGroup(group, size);
  switch (size) {
    case 's':
      return alreadyInGroup < 6;
    case 'm':
      return alreadyInGroup < 12;
    case 'l':
      return alreadyInGroup < 10;
    case 'xl':
      return alreadyInGroup < 2;
    default:
      return false;
  }
};

const genderInGroup = (group: Registration[], gender: string) => {
  return group.filter((reg) => reg.gender === gender).length;
};

const countryInGroup = (group: Registration[], country: string) =>
  group.some((reg) => reg.country === country);

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect('/auth/login');
  }
  if (user.role !== Role.ADMIN) {
    throw new Error('You are not authorized to view this page');
  }
  const countries = await fetch(
    'https://restcountries.com/v2/all?fields=name,alpha2Code,flags'
  ).then((res) => res.json());
  const registrationsQuery = db.registration.findMany({
    where: {
      OR: [
        { registrationStatus: Status.PENDING },
        { registrationStatus: Status.ACCEPTED },
      ],
    },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  const groupsQuery = db.group.findMany({
    orderBy: { name: 'asc' },
    include: { registrations: { include: { user: true } } },
  });
  const [groups, registrations] = await Promise.all([
    groupsQuery,
    registrationsQuery,
  ]);
  registrations.sort((a, b) => {
    if (
      a.registrationStatus === 'ACCEPTED' &&
      b.registrationStatus !== 'ACCEPTED'
    ) {
      return -1;
    }
    if (
      a.registrationStatus !== 'ACCEPTED' &&
      b.registrationStatus === 'ACCEPTED'
    ) {
      return 1;
    }
    if (prioToNum(a.priority) > prioToNum(b.priority)) {
      return -1;
    }
    if (prioToNum(a.priority) < prioToNum(b.priority)) {
      return 1;
    }
    if (statusToNum(a.status) > statusToNum(b.status)) {
      return -1;
    }
    if (statusToNum(a.status) < statusToNum(b.status)) {
      return 1;
    }
    return 0;
  });
  const assignments: { [groupId: string]: Registration[] } = {};
  const nonAssigned: Registration[] = [];
  groups.forEach((group) => {
    assignments[group.id] = [];
    assignments[group.id] = group.registrations;
  });
  registrations
    .filter((registration) => !registration.groupId)
    .forEach((registration) => {
      let assigned = false;
      groups.sort(
        (a, b) => assignments[a.id].length - assignments[b.id].length
      );
      groups.forEach((group) => {
        if (!assigned) {
          if (!countryInGroup(assignments[group.id], registration.country)) {
            if (
              genderInGroup(assignments[group.id], registration.gender) < 10
            ) {
              if (
                spaceForSizeInGroup(assignments[group.id], registration.size)
              ) {
                if (assignments[group.id].length < 20) {
                  assignments[group.id].push(registration);
                  assigned = true;
                }
              }
            }
          }
        }
      });
      if (!assigned) {
        nonAssigned.push(registration);
      }
    });
  //sort groups by name
  groups.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return { registrations, groups, assignments, nonAssigned, countries };
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
  const action = formData.get('action');
  if (typeof action !== 'string') {
    throw new Error('No action specified');
  }
  switch (action) {
    case 'pinGroup': {
      const groupId = formData.get('groupId');
      if (typeof groupId !== 'string') {
        throw new Error('No groupId specified');
      }
      const group = await db.group.findUnique({
        where: { id: groupId },
        include: { registrations: true },
      });
      if (!group) {
        throw new Error('Group not found');
      }
      const registrationIds = formData.get('registrationIds');
      if (typeof registrationIds !== 'string') {
        throw new Error('No registrationIds specified');
      }
      const registrationIdsArray = registrationIds.split(',');
      if (registrationIdsArray.length === 0) {
        throw new Error('No registrations specified');
      }
      await db.registration.updateMany({
        where: { id: { in: registrationIdsArray } },
        data: { groupId: group.id },
      });
      break;
    }
    case 'acceptGroup': {
      const groupId = formData.get('groupId');
      if (typeof groupId !== 'string') {
        throw new Error('No groupId specified');
      }
      const group = await db.group.findUnique({
        where: { id: groupId },
        include: { registrations: true },
      });
      if (!group) {
        throw new Error('Group not found');
      }
      const registrationIds = formData.get('registrationIds');
      if (typeof registrationIds !== 'string') {
        throw new Error('No registrationIds specified');
      }
      const registrationIdsArray = registrationIds.split(',');
      if (registrationIdsArray.length === 0) {
        throw new Error('No registrations specified');
      }
      await db.registration.updateMany({
        where: { id: { in: registrationIdsArray } },
        data: { registrationStatus: Status.ACCEPTED, groupId: group.id },
      });
      break;
    }
    case 'pinUser': {
      const groupId = formData.get('groupId');
      if (typeof groupId !== 'string') {
        throw new Error('No groupId specified');
      }
      const group = await db.group.findUnique({
        where: { id: groupId },
        include: { registrations: true },
      });
      if (!group) {
        throw new Error('Group not found');
      }
      const registrationId = formData.get('registrationId');
      if (typeof registrationId !== 'string') {
        throw new Error('No registrationId specified');
      }
      await db.registration.update({
        where: { id: registrationId },
        data: { groupId: group.id },
      });
      break;
    }
  }
  return null;
};

export default function AdminAssignments() {
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
  const { groups, assignments, nonAssigned, countries } = useLoaderData<{
    registrations: (Registration & { user: User })[];
    groups: Group[];
    assignments: { [groupId: string]: (Registration & { user: User })[] };
    nonAssigned: (Registration & { user: User })[];
    countries: any[];
  }>();
  const getCountry = (code: string) => {
    return countries.find((c) => c.alpha2Code === code);
  };
  const totalAssigned = groups.reduce(
    (acc, group) => acc + assignments[group.id].length,
    0
  );
  return (
    <main>
      <section className="mb-2 p-4 text-white">
        <h1 className="mb-6 text-2xl font-bold">
          Assignments ({groups.length * 20 - totalAssigned} still free)
        </h1>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {groups.map((group) => (
            <div className="border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-lg font-bold">
                    {group.name} ({assignments[group.id].length} assigned)
                  </h3>
                  <p className="mb-4">
                    {
                      assignments[group.id].filter((r) => r.gender === 'm')
                        .length
                    }{' '}
                    male
                  </p>
                </div>
                <div className="flex">
                  <Form method="patch">
                    <input
                      type="hidden"
                      name="action"
                      defaultValue="acceptGroup"
                    />
                    <input
                      type="hidden"
                      name="groupId"
                      defaultValue={group.id}
                    />
                    <input
                      type="hidden"
                      name="registrationIds"
                      defaultValue={assignments[group.id]
                        .map((r) => r.id)
                        .join(',')}
                    />
                    <button>
                      <img
                        src={itemURL('check-all:fluency')}
                        className="w-10"
                      />
                    </button>
                  </Form>
                  <Form method="patch">
                    <input
                      type="hidden"
                      name="action"
                      defaultValue="pinGroup"
                    />
                    <input
                      type="hidden"
                      name="groupId"
                      defaultValue={group.id}
                    />
                    <input
                      type="hidden"
                      name="registrationIds"
                      defaultValue={assignments[group.id]
                        .map((r) => r.id)
                        .join(',')}
                    />
                    <button>
                      <img src={itemURL('pin:fluency')} className="w-10" />
                    </button>
                  </Form>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                {assignments[group.id].map((registration) => (
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      referrerPolicy="no-referrer"
                      src={registration.user.photo}
                      alt={registration.user.firstName}
                    />
                    <div className="ml-2 overflow-hidden">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg">
                        {registration.groupId ? '📌' : ''}
                        {registration.registrationStatus === 'ACCEPTED'
                          ? '✅'
                          : ''}
                        {registration.paymentStatus === 'SUCCESS' ? '💶' : ''}{' '}
                        {registration.user.firstName}{' '}
                        {registration.user.lastName}
                      </p>
                      <div className="flex items-center">
                        <img
                          src={getCountry(registration.country).flags.svg}
                          className="mr-2 h-4"
                          alt=""
                        />
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {getCountry(registration.country).name}
                        </p>
                      </div>
                    </div>
                    <div className="grow" />
                    <Popover className="relative">
                      <Popover.Button>💭</Popover.Button>

                      <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-2 ring-white ring-opacity-5">
                          <div className="relative grid gap-8 bg-gray-800 p-7">
                            <p>{registration.expectations}</p>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Popover>
                    <Form method="patch">
                      <input
                        type="hidden"
                        name="action"
                        defaultValue="pinUser"
                      />
                      <input
                        type="hidden"
                        name="groupId"
                        defaultValue={group.id}
                      />
                      <input
                        type="hidden"
                        name="registrationId"
                        defaultValue={registration.id}
                      />
                      <button>
                        <img src={itemURL('pin:fluency')} className="w-8" />
                      </button>
                    </Form>
                    <img
                      className="h-8 rounded-full"
                      referrerPolicy="no-referrer"
                      src={itemURL(`${mapGender(registration.gender)}:color`)}
                      alt={registration.gender}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border border-slate-200 p-4">
          <h3 className="mb-4 text-lg font-bold">
            Not assigned ({nonAssigned.length})
          </h3>
          <div className="flex">
            <div className="flex flex-col space-y-4">
              {nonAssigned.map((registration) => (
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    referrerPolicy="no-referrer"
                    src={registration.user.photo}
                    alt={registration.user.firstName}
                  />
                  <div className="ml-2">
                    <p className="text-lg">
                      {registration.groupId ? '📌' : ''}
                      {registration.registrationStatus === 'ACCEPTED'
                        ? '✅'
                        : ''}
                      {registration.user.firstName} {registration.user.lastName}
                    </p>
                    <div className="flex items-center">
                      <img
                        src={getCountry(registration.country).flags.svg}
                        className="mr-2 h-4"
                        alt=""
                      />
                      <p>{getCountry(registration.country).name}</p>
                    </div>
                  </div>
                  <div className="grow" />
                  <img
                    className="ml-4 h-8 rounded-full"
                    referrerPolicy="no-referrer"
                    src={itemURL(`${mapGender(registration.gender)}:color`)}
                    alt={registration.user.firstName}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
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
