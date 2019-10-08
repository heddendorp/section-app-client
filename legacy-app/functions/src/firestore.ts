/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as functions from 'firebase-functions';
import * as moment from 'moment-timezone';
import * as nodemailer from 'nodemailer';
import { firestore } from './index';
import { receipt, waitListMove } from './templates';

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
      const userSnap = await firestore
        .collection('users')
        .doc(value.id)
        .get();
      const eventSnap = await firestore.doc(snap.ref.parent.parent!.path).get();
      const user = userSnap.data();
      const event = eventSnap.data();
      if (!user) {
        throw new functions.https.HttpsError('invalid-argument', `Could not find a record for UID ${value.id}!`);
      }
      if (!event) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          `Could not find a record for path ${snap.ref.parent.parent!.path}!`
        );
      }
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
      const signupQuery = firestore
        .collection('events')
        .doc(context.params['eventId'])
        .collection('signups')
        .where('isWaitList', '==', true)
        .orderBy('timestamp')
        .limit(value.partySize);
      const eventData = await firestore
        .collection('events')
        .doc(context.params['eventId'])
        .get();
      const queryData = await signupQuery.get();
      if (
        !queryData.empty &&
        moment(eventData.data()!.start.toDate())
          .tz('Europe/Berlin')
          .isBefore()
      ) {
        await queryData.docs.map(async (doc: any) => {
          const userSnap = await firestore
            .collection('users')
            .doc(doc.id)
            .get();
          const transporter = nodemailer.createTransport(
            {
              port: 587,
              host: 'postout.lrz.de',
              secure: false,
              auth: { user: 'tumi.tuzeio1@tum.de', pass: functions.config().email.pass }
            },
            { replyTo: 'tumi@zv.tum.de', from: 'tumi.tuzeio1@tum.de' }
          );
          if (userSnap.data()) {
            await transporter.sendMail({
              subject: '[TUMi] Event Update',
              to: userSnap.data()!.email,
              html: waitListMove(eventData.data(), userSnap.data())
            });
          }
          await firestore.doc(doc.ref.path).update({ isWaitList: false });
        });
      }
    }
  });

export const balanceUpdate = functions
  .region('europe-west1')
  .firestore.document('stats/money/transactions/{id}')
  .onCreate(async snap => {
    const value = snap.data() as any;
    if (value) {
      const transporter = nodemailer.createTransport(
        {
          port: 587,
          host: 'postout.lrz.de',
          secure: false,
          auth: { user: 'tumi.tuzeio1@tum.de', pass: functions.config().email.pass }
        },
        { replyTo: 'tumi@zv.tum.de', from: 'tumi.tuzeio1@tum.de' }
      );
      if (value.type !== 'general') {
        await transporter.sendMail({
          subject: '[TUMi] Event Receipt',
          to: value.user.email,
          html: receipt(value)
        });
      }
      await firestore.runTransaction(async transaction => {
        const moneyRef = firestore.collection('stats').doc('money');
        const currentBalance = await transaction.get(moneyRef);
        if (currentBalance && currentBalance.data()) {
          transaction.update(moneyRef, { balance: currentBalance.data()!.balance + value.value });
        }
      });
    }
  });
