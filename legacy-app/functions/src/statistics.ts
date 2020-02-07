import * as functions from 'firebase-functions';
import { firestore } from './index';
import * as _ from 'lodash';

export const updateEventStats = functions.https.onCall(async () => {
  const eventsSnapshot = await firestore
    .collection('events')
    .where('isVisiblePublicly', '==', true)
    .get();
  const events = eventsSnapshot.docs.map(doc => doc.data());
  const signupsSnapshot = await firestore.collectionGroup('signups').get();
  const signups = signupsSnapshot.docs.map(doc => Object.assign(doc.data(), { event: doc.ref.parent.parent!.id }));

  const eventInfos = events.map(event => {
    const eventSignups = signups.filter(signup => signup.event === event.id);
    const totalRegistrations = eventSignups.length;
    const waitListRegistrations = eventSignups.filter(s => s.isWaitlist).length;
    const payedRegistrations = eventSignups.filter(s => s.hasPayed).length;
    const attendedRegistrations = eventSignups.filter(s => s.hasAttended).length;

    return {
      id: event.id,
      start: event.start,
      end: event.end,
      payed: event.hasFee,
      name: event.name,
      icon: event.icon,
      cost: event.fullCost,
      price: event.price,
      online: event.hasOnlineSignup,
      party: event.isTicketTracker,
      totalRegistrations,
      waitListRegistrations,
      payedRegistrations,
      attendedRegistrations
    };
  });

  const stats = {
    eventNum: eventInfos.length,
    partyNum: eventInfos.filter(e => e.party).length,
    onlineNum: eventInfos.filter(e => e.online).length,
    registrationNum: eventInfos.reduce((acc, curr) => acc + curr.totalRegistrations, 0),
    attendedNum: eventInfos.reduce((acc, curr) => acc + curr.attendedRegistrations, 0),
    waitListNum: eventInfos.reduce((acc, curr) => acc + curr.waitListRegistrations, 0),
    cost: eventInfos.reduce((acc, curr) => acc + curr.cost, 0),
    collected: eventInfos.reduce((acc, curr) => acc + curr.price * curr.payedRegistrations, 0),
    payed: {
      eventNum: eventInfos.filter(e => e.payed).length,
      registrationNum: eventInfos.filter(e => e.payed).reduce((acc, curr) => acc + curr.totalRegistrations, 0),
      attendedNum: eventInfos.filter(e => e.payed).reduce((acc, curr) => acc + curr.attendedRegistrations, 0),
      waitListNum: eventInfos.filter(e => e.payed).reduce((acc, curr) => acc + curr.waitListRegistrations, 0),
      payedNum: eventInfos.filter(e => e.payed).reduce((acc, curr) => acc + curr.payedRegistrations, 0),
      cost: eventInfos.filter(e => e.payed).reduce((acc, curr) => acc + curr.cost, 0),
      collected: eventInfos.filter(e => e.payed).reduce((acc, curr) => acc + curr.price * curr.payedRegistrations, 0)
    }
  };
  await deleteCollection(firestore, 'stats/events/items', 200);
  await firestore
    .collection('stats')
    .doc('events')
    .delete();

  const batch = firestore.batch();
  const eventStatsRef = firestore.collection('stats').doc('events');
  batch.set(eventStatsRef, stats);
  eventInfos.forEach(item => {
    const itemRef = eventStatsRef.collection('items').doc();
    batch.set(itemRef, item);
  });
  await batch.commit();
});

export const updateUserStats = functions.https.onCall(async (call, context) => {
  const eventsSnapshot = await firestore.collection('events').get();
  const events = eventsSnapshot.docs.map(doc => doc.data());
  const usersSnapshot = await firestore.collection('users').get();
  const users = usersSnapshot.docs.map(doc => doc.data());
  const signupsSnapshot = await firestore.collectionGroup('signups').get();
  const signups = signupsSnapshot.docs.map(doc => Object.assign(doc.data(), { event: doc.ref.parent.parent!.id }));

  const userInfos = users.map(user => {
    const eventSignups = signups.filter(signup => signup.id === user.id);
    const totalRegistrations = eventSignups.length;
    const waitListRegistrations = eventSignups.filter(s => s.isWaitlist).length;
    const payedRegistrations = eventSignups.filter(s => s.hasPayed).length;
    const attendedRegistrations = eventSignups.filter(s => s.hasAttended).length;
    const tutoredEvents = events.filter(event => event.tutorSignups && event.tutorSignups.includes(user.id)).length;
    const moneySpent = eventSignups
      .filter(s => s.hasPayed)
      .reduce((acc, curr) => acc + events.find(e => e.id === curr.event)!.price, 0);
    const moneyAttended = eventSignups
      .filter(s => s.hasPayed)
      .filter(s => s.hasAttended)
      .reduce((acc, curr) => acc + events.find(e => e.id === curr.event)!.price, 0);

    return {
      id: user.id,
      email: user.email,
      // provider: user.provider || 'unkown',
      tutor: user.isTutor,
      editor: user.isEditor,
      admin: user.isAdmin,
      name: user.firstName + ' ' + user.lastName,
      totalRegistrations,
      waitListRegistrations,
      payedRegistrations,
      attendedRegistrations,
      tutoredEvents,
      moneySpent,
      moneyAttended
    };
  });

  userInfos.sort((b, a) => a.totalRegistrations - b.totalRegistrations);
  const mostRegistrations = userInfos.slice(0, 10);
  userInfos.sort((b, a) => a.attendedRegistrations - b.attendedRegistrations);
  const mostAttended = userInfos.slice(0, 10);
  userInfos.sort((b, a) => a.tutoredEvents - b.tutoredEvents);
  const mostTutored = userInfos.slice(0, 10);

  let stats = {
    userNum: userInfos.length,
    userNumPayed: userInfos.filter(u => u.moneySpent > 0).length,
    userNumAttended: userInfos.filter(u => u.attendedRegistrations > 0).length,
    userNumRegistered: userInfos.filter(u => u.totalRegistrations > 0).length,
    registrationNum: userInfos.reduce((acc, curr) => acc + curr.totalRegistrations, 0),
    attendedNum: userInfos.reduce((acc, curr) => acc + curr.attendedRegistrations, 0),
    waitListNum: userInfos.reduce((acc, curr) => acc + curr.waitListRegistrations, 0),
    spent: userInfos.reduce((acc, curr) => acc + curr.moneySpent, 0),
    spentWell: userInfos.reduce((acc, curr) => acc + curr.moneyAttended, 0),
    mostRegistrations,
    mostAttended,
    mostTutored,
    tutors: userInfos.filter(u => u.tutor)
  };
  await deleteCollection(firestore, 'stats/users/items', 200);
  await firestore
    .collection('stats')
    .doc('users')
    .delete();

  const batch = firestore.batch();
  const eventStatsRef = firestore.collection('stats').doc('users');
  batch.set(eventStatsRef, stats);
  await batch.commit();
  await Promise.all(
    _.chunk(userInfos, 50).map(async chunk => {
      const writeBatch = firestore.batch();
      chunk.forEach(item => {
        const itemRef = eventStatsRef.collection('items').doc();
        writeBatch.set(itemRef, item);
      });
      await writeBatch.commit();
    })
  );
});

function deleteCollection(db: any, collectionPath: any, batchSize: any) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db: any, query: any, batchSize: any, resolve: any, reject: any) {
  query
    .get()
    .then((snapshot: any) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then((numDeleted: any) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
