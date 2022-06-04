import { builder } from '../builder';
import { lexicographicSortSchema, printSchema } from 'graphql';
import * as fs from 'fs';
import path from 'path';

import './enums';
import './tenant';
import './user';
import './organizer';
import './event';
import './userOfTenant';
import './eventRegistration';

export const schema = builder.toSchema({});

const schemaAsString = printSchema(lexicographicSortSchema(schema));

// we will write this schema to a file.
if (process.env.NODE_ENV !== 'production') {
  fs.writeFileSync(
    path.join(process.cwd(), './schema.graphql'),
    schemaAsString
  );
}
