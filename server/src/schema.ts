import { makeSchema } from 'nexus';
import NexusPrismaScalars from 'nexus-prisma/scalars';
import * as types from './types';

export const schema = makeSchema({
  types: [NexusPrismaScalars, types],
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
