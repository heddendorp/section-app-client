import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import PrismaPlugin from '@pothos/plugin-prisma';
import prisma from './client';
import PrismaTypes from './generated/pothos-types';
import { DateTimeResolver, JSONResolver } from 'graphql-scalars';
import { Auth0 } from './helpers/auth0';
import {
  MembershipStatus,
  Prisma,
  Role,
  Tenant,
  User,
  UsersOfTenants,
} from './generated/prisma';
import { createSentryWrapper } from '@pothos/tracing-sentry';
import TracingPlugin, { isRootField } from '@pothos/plugin-tracing';
import { Request } from 'express';

const traceResolver = createSentryWrapper({
  includeArgs: true,
  includeSource: true,
});

export type Context = {
  req: Request;
  token?: { sub: string };
  auth0: Auth0;
  tenant: Tenant;
  user?: User;
  userOfTenant?: UsersOfTenants;
};

export const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
    JSON: {
      Input: any;
      Output: any;
    };
    ID: {
      Input: string;
      Output: string;
    };
    Decimal: {
      Input: Prisma.Decimal;
      Output: Prisma.Decimal;
    };
  };
  AuthScopes: {
    authenticated: boolean;
    public: boolean;
    member: boolean;
    admin: boolean;
  };
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, SimpleObjectsPlugin, TracingPlugin],
  authScopes: async (context) => ({
    authenticated: !!context.auth0,
    public: !!context.user,
    member:
      !!context.user &&
      (context.userOfTenant?.status !== MembershipStatus.NONE ||
        context.userOfTenant?.role === Role.ADMIN),
    admin: !!context.user && context.userOfTenant?.role === Role.ADMIN,
  }),
  tracing: {
    default: (config) => isRootField(config),
    wrap: (resolver, options) => traceResolver(resolver, options),
  },
  prisma: {
    client: prisma,
  },
});

builder.addScalarType('JSON', JSONResolver, {});
builder.scalarType('DateTime', {
  serialize: (value) => value.toJSON(),
  parseValue: (value) => {
    if (typeof value === 'string') {
      return new Date(value);
    } else {
      throw new Error(`Invalid DateTime: ${value}`);
    }
  },
});
builder.scalarType('Decimal', {
  serialize: (value) => value.toString(),
  parseValue: (value) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return new Prisma.Decimal(value);
    } else {
      throw new Error(
        'Decimal scalar can only be parsed from strings or numbers'
      );
    }
  },
});

builder.queryType({});
builder.mutationType({});
