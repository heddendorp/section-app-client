import * as NexusPrismaScalars from 'nexus-prisma/scalars';
import * as types from './types';
import { join } from 'path';
import { makeSchema } from 'nexus';

export const schema = makeSchema({
  types: [NexusPrismaScalars, types],
  outputs: {
    typegen: join(
      __dirname,
      '..',
      '..',
      '..',
      'libs',
      'graphql',
      'src',
      'lib',
      'nexus-typegen.ts'
    ),
    schema: join(
      __dirname,
      '..',
      '..',
      '..',
      'libs',
      'graphql',
      'schema.graphql'
    ),
  },
  contextType: {
    module: join(
      __dirname,
      '..',
      '..',
      '..',
      'libs',
      'graphql',
      'src',
      'lib',
      'context.ts'
    ),
    export: 'Context',
  },
});
