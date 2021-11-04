import { list, nonNull, objectType } from 'nexus';
import { RegistrationMode, Tenant } from '@tumi/server-models';
import { DateTime } from 'luxon';
import { countBy, groupBy, range, transform } from 'lodash';
import { Json } from 'nexus-prisma/scalars';
import { CacheScope } from 'apollo-server-types';

function convertToSeries(growthName) {
  return (connections) => {
    const parts = groupBy(connections, (connection) =>
      DateTime.fromJSDate(connection.createdAt).toISODate()
    );
    const growthSeries = [];
    const totalSeries = [];
    Object.keys(parts).forEach((key, index) => {
      growthSeries.push({
        name: key,
        value: parts[key].length,
      });
      totalSeries.push({
        name: key,
        value: range(index + 1).reduce(
          (previousValue, currentValue) =>
            previousValue + parts[Object.keys(parts)[currentValue]].length,
          0
        ),
      });
    });
    return [
      { name: growthName, series: growthSeries },
      { name: 'Total', series: totalSeries },
    ];
  };
}

export const statisticsType = objectType({
  name: 'statistics',
  definition(t) {
    t.nonNull.int('usersRegistered', {
      resolve: (root: Tenant, args, context) =>
        context.prisma.usersOfTenants.count({
          where: { tenant: { id: root.id } },
        }),
    });
    t.nonNull.int('usersWithCustomer', {
      resolve: (root: Tenant, args, context) =>
        context.prisma.usersOfTenants.count({
          where: {
            tenant: { id: root.id },
            stripeData: { isNot: null },
          },
        }),
    });
    t.nonNull.int('usersWithPaymentMethod', {
      resolve: (root: Tenant, args, context) =>
        context.prisma.usersOfTenants.count({
          where: {
            tenant: { id: root.id },
            stripeData: { paymentMethodId: { not: null } },
          },
        }),
    });
    t.nonNull.int('registrations', {
      resolve: (root: Tenant, args, context) =>
        context.prisma.eventRegistration.count({
          where: {
            event: {
              eventTemplate: { tenant: { id: root.id } },
              id: {
                notIn: [
                  'c486c0ad-c07f-48cd-a330-203ed8b59740',
                  '998851e2-17af-482c-99cb-99a29b543d60',
                ],
              },
            },
          },
        }),
    });
    t.nonNull.int('usersRegisteredEvents', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.user.count({
          where: {
            eventRegistrations: {
              some: {
                event: {
                  id: {
                    notIn: [
                      'c486c0ad-c07f-48cd-a330-203ed8b59740',
                      '998851e2-17af-482c-99cb-99a29b543d60',
                    ],
                  },
                  eventTemplate: {
                    tenant: { id: context.tenant.id },
                  },
                },
              },
            },
          },
        });
      },
    });
    t.nonNull.int('usersRegisteredFreeEvents', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.user.count({
          where: {
            eventRegistrations: {
              some: {
                event: {
                  registrationMode: RegistrationMode.ONLINE,
                  id: {
                    notIn: [
                      'c486c0ad-c07f-48cd-a330-203ed8b59740',
                      '998851e2-17af-482c-99cb-99a29b543d60',
                    ],
                  },
                  eventTemplate: {
                    tenant: { id: context.tenant.id },
                  },
                },
              },
            },
          },
        });
      },
    });
    t.nonNull.int('usersRegisteredPaidEvents', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.user.count({
          where: {
            eventRegistrations: {
              some: {
                event: {
                  registrationMode: RegistrationMode.STRIPE,
                  id: {
                    notIn: [
                      'c486c0ad-c07f-48cd-a330-203ed8b59740',
                      '998851e2-17af-482c-99cb-99a29b543d60',
                    ],
                  },
                  eventTemplate: {
                    tenant: { id: context.tenant.id },
                  },
                },
              },
            },
          },
        });
      },
    });
    t.nonNull.int('paidRegistrations', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.eventRegistration.count({
          where: {
            event: {
              registrationMode: RegistrationMode.STRIPE,
              id: {
                notIn: [
                  'c486c0ad-c07f-48cd-a330-203ed8b59740',
                  '998851e2-17af-482c-99cb-99a29b543d60',
                ],
              },
              eventTemplate: {
                tenant: { id: context.tenant.id },
              },
            },
          },
        });
      },
    });
    t.nonNull.float('totalNetPayments', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.eventRegistration
          .aggregate({
            where: {
              netPaid: { not: null },
              event: {
                registrationMode: RegistrationMode.STRIPE,
                id: {
                  notIn: [
                    'c486c0ad-c07f-48cd-a330-203ed8b59740',
                    '998851e2-17af-482c-99cb-99a29b543d60',
                  ],
                },
                eventTemplate: {
                  tenant: { id: context.tenant.id },
                },
              },
            },
            _sum: { netPaid: true },
          })
          .then(
            ({ _sum: { netPaid } }) =>
              Math.round(netPaid + Number.EPSILON) / 100
          );
      },
    });
    t.nonNull.int('checkins', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.eventRegistration.count({
          where: {
            checkInTime: { not: null },
          },
        });
      },
    });
    t.nonNull.int('totalEvents', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.tumiEvent.count({
          where: {
            registrationMode: { not: RegistrationMode.EXTERNAL },
          },
        });
      },
    });
    t.nonNull.int('paidEvents', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.tumiEvent.count({
          where: {
            registrationMode: RegistrationMode.STRIPE,
          },
        });
      },
    });
    t.nonNull.float('averageEventCost', {
      resolve: (root, args, context, info) => {
        info.cacheControl.setCacheHint({
          maxAge: 120,
          scope: CacheScope.Private,
        });
        return context.prisma.tumiEvent
          .aggregate({
            where: {
              registrationMode: RegistrationMode.STRIPE,
            },
            _avg: { price: true },
          })
          .then(({ _avg: { price } }) => {
            return (
              Math.round((price.toNumber() + Number.EPSILON) * 100) / 100 ?? 0
            );
          });
      },
    });
    t.field({
      name: 'userEventDistribution',
      type: nonNull(list(nonNull(Json))),
      resolve: (root: Tenant, args, context) =>
        context.prisma.user
          .findMany({
            where: {
              tenants: { some: { tenantId: context.tenant.id } },
              eventRegistrations: {
                some: {
                  event: {
                    eventTemplate: { tenantId: context.tenant.id },
                    registrationMode: RegistrationMode.STRIPE,
                    id: {
                      notIn: [
                        'c486c0ad-c07f-48cd-a330-203ed8b59740',
                        '998851e2-17af-482c-99cb-99a29b543d60',
                      ],
                    },
                  },
                },
              },
            },
            include: {
              eventRegistrations: {
                where: {
                  event: {
                    eventTemplate: { tenantId: context.tenant.id },
                    registrationMode: RegistrationMode.STRIPE,
                    id: {
                      notIn: [
                        'c486c0ad-c07f-48cd-a330-203ed8b59740',
                        '998851e2-17af-482c-99cb-99a29b543d60',
                      ],
                    },
                  },
                },
              },
            },
          })
          .then((res) => {
            return countBy(res, (user) => user.eventRegistrations.length);
          })
          .then((res) => {
            return transform(
              res,
              (result, value, events) =>
                result.push({ name: `${String(events)} events`, value }),
              []
            );
          }),
    });
    t.field({
      name: 'userHistory',
      type: nonNull(list(nonNull(Json))),
      resolve: (root: Tenant, args, context) =>
        context.prisma.usersOfTenants
          .findMany({
            where: { tenant: { id: root.id } },
          })
          .then(convertToSeries('New Users')),
    });
    t.field({
      name: 'registrationHistory',
      type: nonNull(list(nonNull(Json))),
      resolve: (root: Tenant, args, context) =>
        context.prisma.eventRegistration
          .findMany({
            where: { event: { eventTemplate: { tenant: { id: root.id } } } },
          })
          .then(convertToSeries('New Registrations')),
    });
    t.field({
      name: 'refundHistory',
      type: nonNull(list(nonNull(Json))),
      resolve: (root: Tenant, args, context) =>
        context.prisma.refundedRegistration
          .findMany({
            where: { tenant: { id: root.id } },
          })
          .then(convertToSeries('New Refunds')),
    });
  },
});

export const userHistoryItemType = objectType({
  name: 'userHistoryItem',
  definition(t) {
    t.nonNull.string('name');
    t.field({
      name: 'series',
      type: nonNull(list(nonNull(lineChartSeriesItemType))),
    });
  },
});

export const lineChartSeriesItemType = objectType({
  name: 'lineChartSeriesItem',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.int('value');
  },
});
