import * as functions from 'firebase-functions';
import { firestore } from './index';
import got from 'got';

export const selfPromotion = functions.https.onCall(async (_, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }
  const snapshot = await firestore
    .collection('users')
    .doc(context.auth.uid)
    .get();
  const user = snapshot.data();
  if (!user) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The authenticated user could not be found in the database.'
    );
  }
  if (user.isTutor || user.isAdmin || user.isEditor) {
    await snapshot.ref.update({
      status: 'TRAIL',
      isTutor: false,
      isEditor: false,
    });
  }
});

export const confirmPayment = functions.https.onCall(
  async (
    { eventId, orderId }: { eventId: string; orderId: string },
    context
  ) => {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      );
    }
    const orderInfo = await got(
      `https://api.paypal.com/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${functions.config().paypal.id}:${
              functions.config().paypal.secret
            }`
          ).toString('base64')}`,
        },
      }
    ).json<any>();
    console.log(orderInfo.purchase_units);
    if (orderInfo.status !== 'COMPLETED') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The payment for this event was not completed.'
      );
    }
    await firestore
      .collection('events')
      .doc(eventId)
      .collection('signups')
      .doc(context.auth.uid)
      .set({
        id: context.auth.uid,
        partySize: 1,
        hasPayed: true,
        hasAttended: false,
        paypal: {
          orderId,
          payer: orderInfo.payer,
          purchase_units: orderInfo.purchase_units,
        },
        timestamp: new Date(),
      });
  }
);

export const registerForEvent = functions /*.region('europe-west1')*/.https
  .onCall(
    async (
      { eventId, type }: { eventId: string; type: 'tutor' | 'student' },
      context
    ) => {
      if (!eventId || typeof eventId !== 'string' || !eventId.length) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'The function must be called with one argument "eventId" containing the event ID.'
        );
      }
      if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
          'failed-precondition',
          'The function must be called while authenticated.'
        );
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
        throw new functions.https.HttpsError(
          'invalid-argument',
          `Could not find an event with id ${eventId}!`
        );
      }
      if (!user) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          `Could not find a record for UID ${context.auth.uid}!`
        );
      }

      if (type === 'tutor') {
        if (event.tutorSpots <= event.tutorSignups.length) {
          throw new functions.https.HttpsError(
            'failed-precondition',
            `There are no free tutor spots on ${event.name}!`
          );
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
        if (
          !event.isInternal &&
          event.participantSpots <= event.usersSignedUp
        ) {
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
          .set({
            id: context.auth.uid,
            partySize: 1,
            hasPayed: false,
            hasAttended: false,
            timestamp: new Date(),
          });
      }
    }
  );

export const removeRegistration = functions /*.region('europe-west1')*/.https
  .onCall(async ({ eventId }: { eventId: string }, context) => {
    if (!eventId || typeof eventId !== 'string' || !eventId.length) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one argument "eventId" containing the event ID.'
      );
    }
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      );
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
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Could not find an event with id ${eventId}!`
      );
    }
    if (!user) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Could not find a record for UID ${context.auth.uid}!`
      );
    }
    if (!signup) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Could not find a signup for UID ${context.auth.uid}!`
      );
    }
    if (signup.hasPayed) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Already payed signups can not be deleted like this!`
      );
    }
    await signupSnapshot.ref.delete();
  });
