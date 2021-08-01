import * as NexusPrismaScalars from 'nexus-prisma/scalars'
import { makeSchema } from 'nexus'

export const schema = makeSchema({
  types: [NexusPrismaScalars]
});
