import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import styles from './styles/app.css';

export const meta: MetaFunction = () => {
  return {
    title: 'Party Animals',
    description:
      'Party Animals is the best way to start your exchange in munich',
    'og:description':
      'Party Animals is the best way to start your exchange in munich',
    image: '/social-logo.png',
    'og:image': '/social-logo.png',
  };
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Something went wrong</h1>
        <Scripts />
        <script
          data-collect-dnt="true"
          async
          src="https://data.esn.world/latest.js"
        />
        <script async src="https://data.esn.world/auto-events.js"></script>
        <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-slate-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          data-collect-dnt="true"
          async
          src="https://data.esn.world/latest.js"
        />
        <script async src="https://data.esn.world/auto-events.js"></script>
        <noscript>
          <img
            src="https://data.esn.world/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </body>
    </html>
  );
}
