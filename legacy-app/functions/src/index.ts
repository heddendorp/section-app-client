import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const app = admin.initializeApp();
const firestore = app.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const registerForEvent = functions.https.onCall(
  async ({ eventId, type }: { eventId: string; type: 'tutor' | 'student' }, context) => {
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
      if (event.tutorSpots <= event.tutors.length) {
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
        .update({ tutors: [...event.tutors, context.auth.uid] });
    } else if (type === 'student') {
      if (!event.internal && event.participantSpots <= event.payedSignups.length + event.onlineSignups.length) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `There are no free student spots on ${event.name}!`
        );
      }
      await firestore
        .collection('events')
        .doc(eventId)
        .update({ onlineSignups: [...event.onlineSignups, context.auth.uid] });
    }
  }
);

export const newUser = functions.auth.user().onCreate(async user => {
  const displayName = user.displayName || '';
  const [firstName, ...lastNames] = displayName.split(' ');
  const userEntry = {
    email: user.email,
    verified: user.emailVerified,
    firstName: firstName || '',
    lastName: lastNames.join(' ') || '',
    id: user.uid,
    isAdmin: false,
    isTutor: false,
    isEditor: false
  };
  await firestore
    .collection('users')
    .doc(userEntry.id)
    .set(userEntry);
});

export const balanceUpdate = functions.firestore.document('stats/money/transactions/{id}').onCreate(async snap => {
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
