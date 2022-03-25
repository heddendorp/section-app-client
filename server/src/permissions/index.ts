import { allow, shield } from 'graphql-shield';

export const permissions = shield(
  {
    Query: {},
    Mutation: {},
  },
  { fallbackRule: allow, allowExternalErrors: true }
);
