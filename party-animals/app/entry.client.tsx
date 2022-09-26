import { hydrate } from 'react-dom';
import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document, <RemixBrowser />);
