// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDiDVg6ggmSY-Z8Iu5dWO83Mg4GTmt8Zl0',
    authDomain: 'esn-tumi.firebaseapp.com',
    databaseURL: 'https://esn-tumi.firebaseio.com',
    projectId: 'esn-tumi',
    storageBucket: '',
    messagingSenderId: '756904945827',
    appId: '1:756904945827:web:c4b8570bf907f627'
  },
  functionsOrigin: 'https://esn-tumi.de'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
