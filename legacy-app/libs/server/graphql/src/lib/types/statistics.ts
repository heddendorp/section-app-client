import { list, nonNull, objectType } from 'nexus';
import { Tenant } from '@tumi/server-models';
import { DateTime } from 'luxon';
import { groupBy, range } from 'lodash';
import { Json } from 'nexus-prisma/scalars';

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
    console.log(growthSeries);
    return [
      { name: growthName, series: growthSeries },
      { name: 'Total', series: totalSeries },
    ];
  };
}

export const statisticsType = objectType({
  name: 'statistics',
  definition(t) {
    t.nonNull.int('registeredUsers', {
      resolve: (root: Tenant, args, context) =>
        context.prisma.usersOfTenants.count({
          where: { tenant: { id: root.id } },
        }),
    });
    t.nonNull.int('registrations', {
      resolve: (root: Tenant, args, context) =>
        context.prisma.eventRegistration.count({
          where: { event: { eventTemplate: { tenant: { id: root.id } } } },
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
