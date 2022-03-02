import type { ActionFunction, LoaderFunction } from 'remix';
import { authenticator } from '~/services/auth.server';
import { redirect } from 'remix';

export let loader: LoaderFunction = () => redirect('/registration');

export let action: ActionFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request);
};
