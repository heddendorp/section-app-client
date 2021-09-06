import * as NexusPrismaScalars from 'nexus-prisma/scalars';
import * as types from './types';
import {makeSchema } from 'nexus';

export const schema = makeSchema({
  types: [NexusPrismaScalars, types],
});
