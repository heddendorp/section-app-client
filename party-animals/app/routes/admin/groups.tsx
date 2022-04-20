import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from '~/services/auth.server';
import { Group, Role } from '~/generated/prisma';
import { db } from '~/utils/db.server';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import { ValidationMessage } from '~/components/ValidationMessage';

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
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  const groups = db.group.findMany({
    orderBy: { name: 'asc' },
  });
  return Promise.all([groups, registrations, countries]);
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
  const data = await request.formData();
  const name = data.get('name');
  const errors: { [key: string]: string } = {};
  if (typeof name !== 'string' || name.length < 3) {
    errors.firstName = 'The name must be at least 3 characters long';
    const values = Object.fromEntries(data);
    return { errors, values };
  } else {
    const group = await db.group.create({ data: { name } });
    return { group };
  }
};

export default function AdminGroups() {
  const [groups, registrations, countries] =
    useLoaderData<[Group[], any, any]>();
  const transition = useTransition();
  const actionData = useActionData();
  return (
    <main>
      <section className="mb-2 p-4 text-white">
        <h1 className="mb-4 text-2xl font-bold">Groups</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {groups.map((group) => (
            <div className="border border-slate-200 p-4">
              <strong>{group.name}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-2 p-4 text-white">
        <Form
          method="post"
          className="grid grid-cols-1 gap-4 rounded-lg border-2 border-slate-400 p-4 md:grid-cols-2"
        >
          <h1 className="text-lg font-bold md:col-span-2">Create Group</h1>
          <label
            className="relative block rounded-lg border-2 border-gray-200 p-3"
            htmlFor="lastName"
          >
            <input
              className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
              id="name"
              name="name"
              type="text"
              placeholder="Group name"
              required
              defaultValue={actionData?.values?.name}
            />
            <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
              Group name
            </span>
            {actionData?.errors?.name ? (
              <ValidationMessage
                isSubmitting={transition.state === 'submitting'}
                error={actionData?.errors?.name}
              />
            ) : null}
          </label>
          <button className="inline-block rounded-lg border border-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500">
            Create Group
          </button>
          {/*<label
            className="relative block rounded-lg border-2 border-gray-200 p-3"
            htmlFor="lastName"
          >
            <input
              className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              required
              defaultValue={actionData?.values?.lastName}
            />
            <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
              Last name
            </span>
            {actionData?.errors.lastName ? (
              <ValidationMessage
                isSubmitting={transition.state === 'submitting'}
                error={actionData?.errors?.lastName}
              />
            ) : null}
          </label>*/}
        </Form>
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
