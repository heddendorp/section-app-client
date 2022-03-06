import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { Role } from '~/generated/prisma';
import { Link, Outlet } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect('/auth/login');
  }
  if (user.role !== Role.ADMIN) {
    throw new Error('You are not authorized to access this page');
  }
  return null;
};

export default function AdminFrame() {
  return (
    <div className="m-4 md:m-6">
      <nav className="mx-auto flex max-w-3xl items-center justify-between p-4">
        {/*<a*/}
        {/*  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"*/}
        {/*  href="/"*/}
        {/*>*/}
        {/*  👋*/}
        {/*</a>*/}

        <ul className="flex items-center space-x-2 text-sm font-medium text-gray-200">
          <li className="hidden lg:block">
            <Link className="rounded-lg px-3 py-2" to="registrations">
              Registrations
            </Link>
          </li>

          <li>
            <a className="rounded-lg px-3 py-2" href="">
              Groups
            </a>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
