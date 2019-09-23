import * as functions from 'firebase-functions';
import { firestore } from './index';

export const newUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async user => {
    const displayName = user.displayName || '';
    const [firstName, ...lastNames] = displayName.split(' ');
    const userEntry = {
      email: user.email,
      verified: user.emailVerified,
      firstName: firstName || '',
      lastName: lastNames.join(' ') || '',
      id: user.uid,
      provider: user.providerData[0].providerId || '',
      photoURL: user.providerData[0].photoURL || '',
      isAdmin: false,
      isTutor: false,
      isEditor: false
    };
    console.log('User created: ', user.email);
    await firestore
      .collection('users')
      .doc(userEntry.id)
      .set(userEntry);
  });
