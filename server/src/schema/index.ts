import { builder } from '../builder';
import { lexicographicSortSchema, printSchema } from 'graphql';
import * as fs from 'fs';
import path from 'path';

import './activityLog';
import './costItem';
import './dcc';
import './enums';
import './event';
import './eventOrganizer';
import './eventRegistration';
import './eventRegistrationCode';
import './eventTemplate';
import './eventTemplateCategory';
import './receipt';
import './eventSubmission';
import './eventSubmissionItem';
import './tenant';
import './transaction';
import './user';
import './userOfTenant';
import './stripePayment';
import './statistics';
// import './stripeUserData';
import './photoShare';

export const schema = builder.toSchema({});

const schemaAsString = printSchema(lexicographicSortSchema(schema));

// we will write this schema to a file.
if (process.env.NODE_ENV !== 'production') {
  fs.writeFileSync(
    path.join(process.cwd(), './schema.graphql'),
    schemaAsString
  );
}
