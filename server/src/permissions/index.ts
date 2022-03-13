import { allow, shield } from 'graphql-shield';

export const permissions = shield(
  {
    Query: {},
  },
  { fallbackRule: allow }
);
