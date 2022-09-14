import { builder } from '../../builder';

export const statisticsType = builder.simpleObject('Statistics', {
  fields: (t) => ({
    usersRegistered: t.int(),
    usersWithCustomer: t.int(),
    usersWithPaymentMethod: t.int(),
    registrations: t.int(),
    usersRegisteredEvents: t.int(),
    usersRegisteredFreeEvents: t.int(),
    usersRegisteredPaidEvents: t.int(),
    paidRegistrations: t.int(),
    checkins: t.int(),
    totalEvents: t.int(),
    paidEvents: t.int(),
    userEventDistribution: t.field({ type: 'JSON' }),
    userUniversityDistribution: t.field({ type: 'JSON' }),
    userStatusDistribution: t.field({ type: 'JSON' }),
    localStatusDistribution: t.field({ type: 'JSON' }),
    userHistory: t.field({ type: 'JSON' }),
    registrationHistory: t.field({ type: 'JSON' }),
    checkinHistory: t.field({ type: 'JSON' }),
  }),
});
