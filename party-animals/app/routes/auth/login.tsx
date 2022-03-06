import { itemURL } from '~/utils';
import { Form } from '@remix-run/react';

export default function AuthLogin() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className=" flex flex-col items-center space-y-4 rounded-lg border-2 bg-white bg-opacity-10 p-6 md:flex-row md:space-x-4">
        <img src={itemURL('password:nolan')} className="w-32" />
        <div>
          <p className="mb-6 text-slate-300">Please log in to continue.</p>
          <Form action="/auth/auth0" method="post">
            <button className="inline-block w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
              <span className="block rounded-full bg-slate-800 px-8 py-3 text-sm font-medium text-white hover:bg-transparent">
                Login
              </span>
            </button>
          </Form>
        </div>
      </div>
    </main>
  );
}
