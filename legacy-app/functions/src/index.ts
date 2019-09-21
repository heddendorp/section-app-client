import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const app = admin.initializeApp();
const firestore = app.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const registerForEvent = functions/*.region('europe-west1')*/
.https
  .onCall(async ({ eventId, type }: { eventId: string; type: 'tutor' | 'student' }, context) => {
    if (!eventId || typeof eventId !== 'string' || !eventId.length) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one argument "eventId" containing the event ID.'
      );
    }
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }
    const userSnapshot = await firestore
      .collection('users')
      .doc(context.auth.uid)
      .get();
    const eventSnapshot = await firestore
      .collection('events')
      .doc(eventId)
      .get();
    const user = userSnapshot.data();
    const event = eventSnapshot.data();
    if (!event) {
      throw new functions.https.HttpsError('invalid-argument', `Could not find an event with id ${eventId}!`);
    }
    if (!user) {
      throw new functions.https.HttpsError('invalid-argument', `Could not find a record for UID ${context.auth.uid}!`);
    }

    if (type === 'tutor') {
      if (event.tutorSpots <= event.tutorSignups.length) {
        throw new functions.https.HttpsError('failed-precondition', `There are no free tutor spots on ${event.name}!`);
      }
      if (!user.isTutor && !user.isAdmin) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Only admins and tutors can sign up as a tutor for events!`
        );
      }
      await firestore
        .collection('events')
        .doc(eventId)
        .update({ tutorSignups: [...event.tutorSignups, context.auth.uid] });
    } else if (type === 'student') {
      if (!event.isInternal && event.participantSpots <= event.usersSignedUp) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `There are no free student spots on ${event.name}!`
        );
      }
      await firestore
        .collection('events')
        .doc(eventId)
        .collection('signups')
        .doc(context.auth.uid)
        .set({ id: context.auth.uid, partySize: 1, hasPayed: false, hasAttended: false });
    }
  });

export const removeRegistration = functions/*.region('europe-west1')*/
.https
  .onCall(async ({ eventId }: { eventId: string }, context) => {
    if (!eventId || typeof eventId !== 'string' || !eventId.length) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one argument "eventId" containing the event ID.'
      );
    }
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }
    const userSnapshot = await firestore
      .collection('users')
      .doc(context.auth.uid)
      .get();
    const eventSnapshot = await firestore
      .collection('events')
      .doc(eventId)
      .get();
    const signupSnapshot = await firestore
      .collection('events')
      .doc(eventId)
      .collection('signups')
      .doc(context.auth.uid)
      .get();
    const user = userSnapshot.data();
    const event = eventSnapshot.data();
    const signup = signupSnapshot.data();
    if (!event) {
      throw new functions.https.HttpsError('invalid-argument', `Could not find an event with id ${eventId}!`);
    }
    if (!user) {
      throw new functions.https.HttpsError('invalid-argument', `Could not find a record for UID ${context.auth.uid}!`);
    }
    if (!signup) {
      throw new functions.https.HttpsError('invalid-argument', `Could not find a signup for UID ${context.auth.uid}!`);
    }
    if (signup.hasPayed) {
      throw new functions.https.HttpsError('invalid-argument', `Already payed signups can not be deleted like this!`);
    }
    await signupSnapshot.ref.delete();
  });

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
    await firestore
      .collection('users')
      .doc(userEntry.id)
      .set(userEntry);
  });

export const newEvent = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}')
  .onCreate(async (snap, context) => {
    await firestore
      .collection('events')
      .doc(context.params['eventId'])
      .update({ usersSignedUp: 0 });
  });

export const newSignup = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}/signups/{signupId}')
  .onCreate(async (snap, context) => {
    const value = snap.data();
    if (value) {
      await firestore.runTransaction(async transaction => {
        const eventRef = firestore.collection('events').doc(context.params['eventId']);
        const currentData = await transaction.get(eventRef);
        if (currentData && currentData.data()) {
          transaction.update(eventRef, { usersSignedUp: currentData.data()!.usersSignedUp + value.partySize });
        }
      });
    }
  });

export const updatedSignup = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}/signups/{signupId}')
  .onUpdate(async (change, context) => {
    const oldValue = change.before.data()!.partySize;
    const newValue = change.after.data()!.partySize;
    const difference = newValue - oldValue;
    if (difference !== 0) {
      await firestore.runTransaction(async transaction => {
        const eventRef = firestore.collection('events').doc(context.params['eventId']);
        const currentData = await transaction.get(eventRef);
        if (currentData && currentData.data()) {
          transaction.update(eventRef, { usersSignedUp: currentData.data()!.usersSignedUp + difference });
        }
      });
    }
  });

export const deletedSignup = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}/signups/{signupId}')
  .onDelete(async (snap, context) => {
    const value = snap.data();
    if (value) {
      await firestore.runTransaction(async transaction => {
        const eventRef = firestore.collection('events').doc(context.params['eventId']);
        const currentData = await transaction.get(eventRef);
        if (currentData && currentData.data()) {
          transaction.update(eventRef, { usersSignedUp: currentData.data()!.usersSignedUp - value.partySize });
        }
      });
    }
  });

export const balanceUpdate = functions
  .region('europe-west1')
  .firestore.document('stats/money/transactions/{id}')
  .onCreate(async snap => {
    const value = snap.data();
    if (value) {
      await firestore.runTransaction(async transaction => {
        const moneyRef = firestore.collection('stats').doc('money');
        const currentBalance = await transaction.get(moneyRef);
        if (currentBalance && currentBalance.data()) {
          transaction.update(moneyRef, { balance: currentBalance.data()!.balance + value.value });
        }
      });
    }
  });
