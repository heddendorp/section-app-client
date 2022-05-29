import { arg, inputObjectType, list, nonNull, objectType } from 'nexus';
import { RegistrationMode, Tenant } from '../generated/prisma';
import { DateTime } from 'luxon';
import { countBy, groupBy, range, transform } from 'lodash';
import { EnvelopError } from '@envelop/core';
import { GraphQLYogaError } from '@graphql-yoga/node';

function convertToSeries(growthName) {
  return (connections) => {
    const parts = groupBy(connections, (connection) =>
      DateTime.fromJSDate(connection.createdAt).toISODate()
    );
    const growthSeries: { name: string; value: number }[] = [];
    const totalSeries: { name: string; value: number }[] = [];
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
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.usersOfTenants
          .count({
            where: {
              tenant: { id: root.id },
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
            },
          })
          .then((res) => {
            if (!res) {
              throw new GraphQLYogaError('No users registered');
            }
            return res;
          }),
    });
    t.nonNull.int('usersWithCustomer', {
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.usersOfTenants.count({
          where: {
            tenant: { id: root.id },
            stripeData: { isNot: null },
            ...(range
              ? { createdAt: { gte: range.start, lte: range.end } }
              : {}),
          },
        }),
    });
    t.nonNull.int('usersWithPaymentMethod', {
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.usersOfTenants.count({
          where: {
            tenant: { id: root.id },
            stripeData: { paymentMethodId: { not: null } },
            ...(range
              ? { createdAt: { gte: range.start, lte: range.end } }
              : {}),
          },
        }),
    });
    t.nonNull.int('registrations', {
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.eventRegistration.count({
          where: {
            event: {
              eventTemplate: { tenant: { id: root.id } },
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
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
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        return context.prisma.user.count({
          where: {
            eventRegistrations: {
              some: {
                event: {
                  ...(range
                    ? { createdAt: { gte: range.start, lte: range.end } }
                    : {}),
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
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        return context.prisma.user.count({
          where: {
            eventRegistrations: {
              some: {
                event: {
                  registrationMode: RegistrationMode.ONLINE,
                  ...(range
                    ? { createdAt: { gte: range.start, lte: range.end } }
                    : {}),
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
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 120,
        //   scope: CacheScope.Private,
        // });
        return context.prisma.user.count({
          where: {
            eventRegistrations: {
              some: {
                event: {
                  ...(range
                    ? { createdAt: { gte: range.start, lte: range.end } }
                    : {}),
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
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        return context.prisma.eventRegistration.count({
          where: {
            event: {
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
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
    // t.nonNull.float('totalNetPayments', {
    //   resolve: (root, args, context, info) => {
    //     info.cacheControl.setCacheHint({
    //       maxAge: 120,
    //       scope: CacheScope.Private,
    //     });
    //     return context.prisma.eventRegistration
    //       .aggregate({
    //         where: {
    //           netPaid: { not: null },
    //           event: {
    //             registrationMode: RegistrationMode.STRIPE,
    //             id: {
    //               notIn: [
    //                 'c486c0ad-c07f-48cd-a330-203ed8b59740',
    //                 '998851e2-17af-482c-99cb-99a29b543d60',
    //               ],
    //             },
    //             eventTemplate: {
    //               tenant: { id: context.tenant.id },
    //             },
    //           },
    //         },
    //         _sum: { netPaid: true },
    //       })
    //       .then(
    //         ({ _sum: { netPaid } }) =>
    //           Math.round(netPaid + Number.EPSILON) / 100
    //       );
    //   },
    // });
    t.nonNull.int('checkins', {
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        return context.prisma.eventRegistration.count({
          where: {
            checkInTime: { not: null },
            event: {
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
            },
          },
        });
      },
    });
    t.nonNull.int('totalEvents', {
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        return context.prisma.tumiEvent.count({
          where: {
            registrationMode: { not: RegistrationMode.EXTERNAL },
            ...(range
              ? { createdAt: { gte: range.start, lte: range.end } }
              : {}),
          },
        });
      },
    });
    t.nonNull.int('paidEvents', {
      args: { range: arg({ type: dateRangeInputType }) },
      resolve: (root, { range }, context) => {
        return context.prisma.tumiEvent.count({
          where: {
            registrationMode: RegistrationMode.STRIPE,
            ...(range
              ? { createdAt: { gte: range.start, lte: range.end } }
              : {}),
          },
        });
      },
    });
    // t.nonNull.float('averageEventCost', {
    //   resolve: (root, args, context, info) => {
    //     info.cacheControl.setCacheHint({
    //       maxAge: 120,
    //       scope: CacheScope.Private,
    //     });
    //     return context.prisma.tumiEvent
    //       .aggregate({
    //         where: {
    //           registrationMode: RegistrationMode.STRIPE,
    //         },
    //         _avg: { price: true },
    //       })
    //       .then(({ _avg: { price } }) => {
    //         return (
    //           Math.round((price.toNumber() + Number.EPSILON) * 100) / 100 ?? 0
    //         );
    //       });
    //   },
    // });
    t.field({
      name: 'userEventDistribution',
      type: nonNull(list(nonNull('Json'))),
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.user
          .findMany({
            where: {
              tenants: { some: { tenantId: context.tenant.id } },
              eventRegistrations: {
                some: {
                  event: {
                    ...(range
                      ? { createdAt: { gte: range.start, lte: range.end } }
                      : {}),
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
              (
                result: { name: string; value: any }[],
                value: any,
                events: any
              ) => result.push({ name: `${String(events)} events`, value }),
              []
            );
          }),
    });
    t.field({
      name: 'userUniversityDistribution',
      type: nonNull(list(nonNull('Json'))),
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.user
          .groupBy({
            where: {
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
              tenants: { some: { tenantId: context.tenant.id } },
            },
            by: ['university'],
            _count: { university: true },
          })
          .then((res) =>
            res.map((entry) => ({
              uni: entry.university,
              count: entry._count.university,
            }))
          ),
    });
    t.field({
      name: 'userStatusDistribution',
      type: nonNull(list(nonNull('Json'))),
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.user
          .groupBy({
            where: {
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
              tenants: { some: { tenantId: context.tenant.id } },
            },
            by: ['enrolmentStatus'],
            _count: { enrolmentStatus: true },
          })
          .then((res) =>
            res.map((entry) => ({
              status: entry.enrolmentStatus,
              count: entry._count.enrolmentStatus,
            }))
          ),
    });
    t.field({
      name: 'userHistory',
      type: nonNull(list(nonNull('Json'))),
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.usersOfTenants
          .findMany({
            where: {
              tenant: { id: root.id },
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
            },
            orderBy: { createdAt: 'asc' },
          })
          .then(convertToSeries('New Users')),
    });
    t.field({
      name: 'registrationHistory',
      type: nonNull(list(nonNull('Json'))),
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.eventRegistration
          .findMany({
            where: {
              event: {
                ...(range
                  ? { createdAt: { gte: range.start, lte: range.end } }
                  : {}),
                eventTemplate: { tenant: { id: root.id } },
              },
            },
            orderBy: { createdAt: 'asc' },
          })
          .then(convertToSeries('New Registrations')),
    });
    t.field({
      name: 'refundHistory',
      type: nonNull(list(nonNull('Json'))),
      args: { range: arg({ type: dateRangeInputType }) },
      // @ts-ignore
      resolve: (root: Tenant, { range }, context) =>
        context.prisma.refundedRegistration
          .findMany({
            where: {
              ...(range
                ? { createdAt: { gte: range.start, lte: range.end } }
                : {}),
              tenant: { id: root.id },
            },
            orderBy: { createdAt: 'asc' },
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

export const dateRangeInputType = inputObjectType({
  name: 'DateRangeInput',
  definition(t) {
    t.field('start', {
      type: nonNull('DateTime'),
    });
    t.field('end', {
      type: nonNull('DateTime'),
    });
  },
});
