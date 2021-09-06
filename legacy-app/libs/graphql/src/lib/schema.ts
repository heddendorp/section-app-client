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
    ), // 2
    schema: join(
      __dirname,
      '..',
      '..',
      '..',
      'libs',
      'graphql',
      'schema.graphql'
    ), // 3
  },
});
