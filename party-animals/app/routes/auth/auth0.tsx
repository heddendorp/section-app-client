import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from '~/services/auth.server';

export let loader: LoaderFunction = () => redirect('/registration');

export let action: ActionFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request);
};
