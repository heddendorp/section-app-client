import { makeSchema } from 'nexus';
import * as types from './types';
import {
  DateTime,
  Decimal,
  Json,
} from 'nexus-prisma/dist-cjs/entrypoints/scalars';
// import SchemaBuilder from '@pothos/core';
// import { Json, Decimal, DateTime } from 'nexus-prisma/';

// const builder = new SchemaBuilder({});
//
// builder.queryType({
//   fields: (t) => ({
//     hello: t.string({
//       args: {
//         name: t.arg.string(),
//       },
//       resolve: (parent, { name }) => `hello, ${name || 'World'}`,
//     }),
//   }),
// });
//
// export const schema = builder.toSchema({});

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
