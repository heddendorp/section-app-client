// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `workspace.json`.

export const environment = {
  production: false,
  stripeKey:
    'pk_test_51OYTZmADdj7oaBao0kr4zOEtm0Na7V5D3mMP5oc0diE0qraDDumSBhXm5wCvOHWsvSIXcXcDbzpjalvbEQvFods300oIfXfv8Z',
  server: 'http://localhost:3333',
  useApiPath: true,
  version: 'dev',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
