import { LoaderFunction, redirect } from 'remix';
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
import { useLoaderData } from '@remix-run/react';

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
      return alreadyInGroup < 7;
    case 'm':
      return alreadyInGroup < 16;
    case 'l':
      return alreadyInGroup < 5;
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
  const countries = fetch(
    'https://restcountries.com/v2/all?fields=name,alpha2Code,flags'
  ).then((res) => res.json());
  const registrationsQuery = db.registration.findMany({
    where: { registrationStatus: { not: Status.REJECTED } },
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
                assignments[group.id].push(registration);
                assigned = true;
              }
            }
          }
        }
      });
      if (!assigned) {
        nonAssigned.push(registration);
      }
    });
  return { registrations, groups, assignments, nonAssigned };
};

export default function AdminAssignments() {
  const { registrations, groups, assignments, nonAssigned } = useLoaderData<{
    registrations: (Registration & { user: User })[];
    groups: Group[];
    assignments: { [groupId: string]: (Registration & { user: User })[] };
    nonAssigned: (Registration & { user: User })[];
  }>();
  return (
    <main>
      <section className="mb-2 p-4 text-white">
        <h1 className="mb-6 text-2xl font-bold">Assignments</h1>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {groups.map((group) => (
            <div className="border border-slate-200 p-4">
              <h3 className="mb-4 text-lg font-bold">
                {group.name} ({assignments[group.id].length} assigned)
              </h3>
              <div className="flex flex-col space-y-2">
                {assignments[group.id].map((registration) => (
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full"
                      referrerPolicy="no-referrer"
                      src={registration.user.photo}
                      alt={registration.user.firstName}
                    />
                    <div className="ml-2">
                      <p className="text-sm">
                        {registration.user.firstName}{' '}
                        {registration.user.lastName}
                      </p>
                      <p className="text-sm">{registration.country}</p>
                    </div>
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
          <div className="flex flex-col space-y-2">
            {nonAssigned.map((registration) => (
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  referrerPolicy="no-referrer"
                  src={registration.user.photo}
                  alt={registration.user.firstName}
                />
                <div className="ml-2">
                  <p className="text-sm">
                    {registration.user.firstName} {registration.user.lastName}
                  </p>
                  <p className="text-sm">{registration.country}</p>
                </div>
              </div>
            ))}
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
