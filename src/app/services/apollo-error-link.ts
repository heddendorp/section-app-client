import type { ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/core';
import { ErrorLink } from '@apollo/client/link/error';

interface ApolloErrorDependencies {
  addBreadcrumb: (breadcrumb: {
    message: string;
    category: string;
    type: 'error';
    data: Record<string, unknown>;
  }) => void;
  log: (...values: unknown[]) => void;
  logout: () => void;
}

export function createApolloErrorLink(
  dependencies: ApolloErrorDependencies,
): ErrorLink {
  return new ErrorLink(({ error }) => handleApolloError(error, dependencies));
}

export function handleApolloError(
  error: ErrorLike,
  dependencies: ApolloErrorDependencies,
): void {
  if (CombinedGraphQLErrors.is(error)) {
    dependencies.addBreadcrumb({
      message: 'GraphQL error',
      category: 'GraphQL error',
      type: 'error',
      data: {
        errors: error.errors.map(({ message, path }) => ({ message, path })),
      },
    });
    error.errors.forEach(({ message, locations, path }) => {
      if (message.includes('jwt issuer invalid')) {
        dependencies.logout();
      }
      dependencies.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations,
          null,
          2,
        )}, Path: ${JSON.stringify(path)}`,
      );
    });
    return;
  }

  dependencies.addBreadcrumb({
    message: 'Network error',
    category: 'GraphQL error',
    type: 'error',
    data: { name: error.name, message: error.message },
  });
  dependencies.log('[Network error]: ', error);
}
