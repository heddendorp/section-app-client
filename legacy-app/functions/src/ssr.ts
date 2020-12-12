import { VALID_MEMORY_OPTIONS } from 'firebase-functions';
import * as functions from 'firebase-functions';
import * as path from 'path';
const runtimeOpts = {
  timeoutSeconds: 300,
  memory: VALID_MEMORY_OPTIONS[3],
};
export const universal = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    require(path.join(
      process.cwd(),
      'dist',
      'tumi-app',
      'server',
      'main.js'
    )).app()(req, res);
  });
