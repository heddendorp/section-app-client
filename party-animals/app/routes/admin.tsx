import { LoaderFunction, redirect } from "@remix-run/node";
import { NavLink } from "@remix-run/react";
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
    <>
      <nav className="mx-auto flex max-w-3xl items-center justify-between p-4">
        {/*<a*/}
        {/*  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"*/}
        {/*  href="/"*/}
        {/*>*/}
        {/*  👋*/}
        {/*</a>*/}

        <ul className="flex items-center space-x-2 text-sm font-medium text-gray-200">
          <li>
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'font-bold' : ''}`
              }
              to="registrations"
            >
              Registrations
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'font-bold' : ''}`
              }
              to="groups"
            >
              Groups
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'font-bold' : ''}`
              }
              to="assignments"
            >
              Assignments
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'font-bold' : ''}`
              }
              to="status-board"
            >
              Status Board
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
