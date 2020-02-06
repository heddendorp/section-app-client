import * as admin from 'firebase-admin';

const app = admin.initializeApp();
export const firestore = app.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export * from './firestore';
export * from './auth';
export * from './https';
export * from './schedule';
export * from './statistics';
