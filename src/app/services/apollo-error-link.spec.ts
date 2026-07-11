import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { handleApolloError } from './apollo-error-link';

describe('handleApolloError', () => {
  let addBreadcrumb: Mock;
  let log: Mock;
  let logout: Mock;

  beforeEach(() => {
    addBreadcrumb = vi.fn();
    log = vi.fn();
    logout = vi.fn();
  });

  function dependencies() {
    return { addBreadcrumb, log, logout };
  }

  it('handles Apollo ServerError without recording its response body', () => {
    const error = new ServerError('Service unavailable', {
      response: new Response(null, { status: 503 }),
      bodyText: 'sensitive upstream response',
    });

    handleApolloError(error, dependencies());

    expect(addBreadcrumb).toHaveBeenCalledTimes(1);
    expect(addBreadcrumb).toHaveBeenCalledWith({
      message: 'Network error',
      category: 'GraphQL error',
      type: 'error',
      data: { name: 'ServerError', message: 'Service unavailable' },
    });
    expect(logout).not.toHaveBeenCalled();
  });

  it('logs out when a GraphQL response reports an invalid JWT issuer', () => {
    const error = new CombinedGraphQLErrors({
      errors: [
        {
          message: 'jwt issuer invalid',
          path: ['currentUser'],
          extensions: { privateDetail: 'not recorded' },
        },
      ],
    });

    handleApolloError(error, dependencies());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(addBreadcrumb).toHaveBeenCalledTimes(1);
    expect(addBreadcrumb).toHaveBeenCalledWith({
      message: 'GraphQL error',
      category: 'GraphQL error',
      type: 'error',
      data: {
        errors: [{ message: 'jwt issuer invalid', path: ['currentUser'] }],
      },
    });
  });
});
