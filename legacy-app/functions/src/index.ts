import * as admin from 'firebase-admin';

const app = admin.initializeApp();
export const firestore = app.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export * from './firestore';
export * from './auth';
export * from './https';
export * from './schedule';
export * from './statistics';
