import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import PrismaPlugin from '@pothos/plugin-prisma';
import prisma from './client';
import PrismaTypes from './generated/pothos-types';
import {
  DateTimeResolver,
  DateTimeTypeDefinition,
  JSONResolver,
} from 'graphql-scalars';
import { Auth0 } from './helpers/auth0';
import { Tenant, User, UsersOfTenants } from './generated/prisma';

export const builder = new SchemaBuilder<{
  Context: {
    auth0: Auth0;
    tenant: Tenant;
    user?: User;
    userOfTenant?: UsersOfTenants;
  };
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
  };
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, SimpleObjectsPlugin],
  authScopes: async (context) => ({}),
  prisma: {
    client: prisma,
  },
});

builder.addScalarType('DateTime', DateTimeResolver, {});
builder.addScalarType('JSON', JSONResolver, {});

builder.queryType({});
builder.mutationType({});
