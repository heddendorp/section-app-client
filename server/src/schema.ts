import { makeSchema } from 'nexus';
import * as types from './types';
import {
  DateTime,
  Decimal,
  Json,
} from 'nexus-prisma/dist-cjs/entrypoints/scalars';
// import { Json, Decimal, DateTime } from 'nexus-prisma/';

export const schema = makeSchema({
  types: [Json, Decimal, DateTime, types],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});
