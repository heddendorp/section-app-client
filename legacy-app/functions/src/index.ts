import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as csvParse from 'csv-parse/lib/sync';

const app = admin.initializeApp();
const firestore = app.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const replaceList = functions.https.onCall(
  async ({ update, input }: { update: string; input: string }, context) => {
    if (!update || typeof update !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one arguments "update" containing the collection to update.'
      );
    }
    if (!(update === 'tutors' || update === 'students')) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Update request can only be students or tutors. Found: ' + update
      );
    }
    if (!input || typeof input !== 'string' || !input.length) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one arguments "input" containing the csv data for the update.'
      );
    }
    /*if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }*/
    const entries: any[] = csvParse(input, { skip_empty_lines: true, trim: true, from: 2 }).map((entry: any) =>
      entry.filter((column: any) => !!column)
    );
    console.log(entries.slice(0, 3));
    if (!entries || entries.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Updates are only possible with at least one line of data'
      );
    }
    if (entries.find(entry => entry.length < 3)) {
      console.warn(entries.find(entry => entry.length < 3));
      throw new functions.https.HttpsError(
        'invalid-argument',
        'At least one entry does not have the required three attributes'
      );
    }
    let data: any[] = [];
    if (update === 'students') {
      data = entries.map(entry => {
        const student = {
          firstName: entry[0],
          lastName: entry[1],
          email: entry[2].toLocaleLowerCase(),
          faculty: '',
          country: '',
          status: '',
          isStudent: true,
          disabled: false
        };
        if (entry.length >= 4) {
          student.faculty = entry[3];
        }
        if (entry.length >= 5) {
          student.country = entry[4];
        }
        if (entry.length >= 6) {
          student.status = entry[5].toLocaleUpperCase();
          if (!(student.status === 'E' || student.status === 'D')) {
            console.warn(student);
            throw new functions.https.HttpsError(
              'invalid-argument',
              'Student status can only be E or D. Found: ' + student.status
            );
          }
        }
        return student;
      });
    } else if (update === 'tutors') {
      data = entries.map(entry => {
        const student = {
          firstName: entry[0],
          lastName: entry[1],
          email: entry[2].toLocaleLowerCase(),
          faculty: '',
          isTutor: true,
          disabled: false
        };
        if (entry.length >= 4) {
          student.faculty = entry[3];
        }
        return student;
      });
    }
    const currentStudentsSnapshot = await firestore
      .collection('users')
      .where(update === 'tutors' ? 'isTutor' : 'isStudent', '==', true)
      .get();
    const currentStudents = currentStudentsSnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id } as { email: string; id: string };
    });
    const idLookup: { [email: string]: any } = {};
    currentStudents.forEach(student => {
      idLookup[student.email] = student.id;
    });
    const actions: any[] = [];
    currentStudents
      .filter(student => !data.find(date => date.email === student.email))
      .forEach(student =>
        actions.push({
          action: 'update',
          id: student.id,
          data: { disabled: true }
        })
      );
    data.filter(student => !idLookup[student.email]).forEach(student => actions.push({ action: 'add', data: student }));
    data
      .filter(student => idLookup[student.email])
      .forEach(student =>
        actions.push({
          action: 'update',
          data: student,
          id: idLookup[student.email]
        })
      );
    console.log(actions);
    for (let i = 0; i < Math.ceil(actions.length / 400); i++) {
      const batch = firestore.batch();
      actions.slice(i * 400, i * 400 + 399).forEach(action => {
        switch (action.action) {
          case 'add': {
            const ref = firestore.collection('users').doc();
            batch.set(ref, action.data);
            break;
          }
          case 'update': {
            const ref = firestore.collection('users').doc(action.id);
            batch.update(ref, action.data);
            break;
          }
          case 'delete': {
            const ref = firestore.collection('users').doc(action.id);
            batch.delete(ref);
            break;
          }
        }
      });
      await batch.commit();
    }
    return `${update} successfully updated!`;
  }
);

export const newUser = functions.auth.user().onCreate(async user => {
  const userCandidates = await firestore
    .collection('users')
    .where('email', '==', user.email)
    .get();
  if (!userCandidates.empty) {
    userCandidates.docs.forEach(doc =>
      firestore
        .collection('users')
        .doc(doc.id)
        .update({ userId: user.uid })
    );
  } else {
    console.log('No entry found for new user');
    console.log(user);
  }
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
