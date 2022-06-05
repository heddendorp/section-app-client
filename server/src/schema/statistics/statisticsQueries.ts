import { countBy, groupBy, range, transform } from 'lodash';
import { DateTime } from 'luxon';
import { builder } from '../../builder';
import { dateRangeInputType } from './statisticsType';
import prisma from '../../client';
import { RegistrationMode, RegistrationStatus } from '../../generated/prisma';

function convertToSeries(growthName, column = 'createdAt') {
  return (connections) => {
    const parts = groupBy(connections, (connection) =>
      DateTime.fromJSDate(connection[column]).toISODate()
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

builder.queryFields((t) => ({
  statistics: t.field({
    type: 'Statistics',
    args: {
      tenantId: t.arg.id(),
      range: t.arg({ type: dateRangeInputType }),
    },
    resolve: async (query, root, { tenantId, range }, context, info) => {
      const usersRegistered = await prisma.usersOfTenants.count({
        where: {
          ...(tenantId ? { tenantId } : {}),
          ...(range?.start ? { createdAt: { gte: range.start } } : {}),
          ...(range?.end ? { createdAt: { lte: range.end } } : {}),
        },
      });
      const usersWithCustomer = await prisma.usersOfTenants.count({
        where: {
          ...(tenantId ? { tenantId } : {}),
          ...(range?.start ? { createdAt: { gte: range.start } } : {}),
          ...(range?.end ? { createdAt: { lte: range.end } } : {}),
          stripeData: { isNot: null },
        },
      });
      const usersWithPaymentMethod = await prisma.usersOfTenants.count({
        where: {
          ...(tenantId ? { tenantId } : {}),
          ...(range?.start ? { createdAt: { gte: range.start } } : {}),
          ...(range?.end ? { createdAt: { lte: range.end } } : {}),
          stripeData: { paymentMethodId: { not: null } },
        },
      });
      const registrations = await prisma.eventRegistration.count({
        where: {
          event: {
            eventTemplate: {
              ...(tenantId ? { tenantId } : {}),
            },
            excludeFromStatistics: false,
            ...(range?.start ? { start: { gte: range.start } } : {}),
            ...(range?.end ? { start: { lte: range.end } } : {}),
          },
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      const usersRegisteredEvents = await prisma.user.count({
        where: {
          tenants: {
            some: {
              ...(tenantId ? { tenantId } : {}),
            },
          },
          eventRegistrations: {
            some: {
              event: {
                ...(range?.start ? { start: { gte: range.start } } : {}),
                ...(range?.end ? { start: { lte: range.end } } : {}),
                excludeFromStatistics: false,
              },
              status: { not: RegistrationStatus.CANCELLED },
            },
          },
        },
      });
      const usersRegisteredFreeEvents = await prisma.user.count({
        where: {
          tenants: {
            some: {
              ...(tenantId ? { tenantId } : {}),
            },
          },
          eventRegistrations: {
            some: {
              event: {
                ...(range?.start ? { start: { gte: range.start } } : {}),
                ...(range?.end ? { start: { lte: range.end } } : {}),
                excludeFromStatistics: false,
                registrationMode: RegistrationMode.ONLINE,
              },
              status: { not: RegistrationStatus.CANCELLED },
            },
          },
        },
      });
      const usersRegisteredPaidEvents = await prisma.user.count({
        where: {
          tenants: {
            some: {
              ...(tenantId ? { tenantId } : {}),
            },
          },
          eventRegistrations: {
            some: {
              event: {
                ...(range?.start ? { start: { gte: range.start } } : {}),
                ...(range?.end ? { start: { lte: range.end } } : {}),
                excludeFromStatistics: false,
                registrationMode: RegistrationMode.STRIPE,
              },
              status: { not: RegistrationStatus.CANCELLED },
            },
          },
        },
      });
      const paidRegistrations = await prisma.eventRegistration.count({
        where: {
          event: {
            eventTemplate: {
              ...(tenantId ? { tenantId } : {}),
            },
            excludeFromStatistics: false,
            ...(range?.start ? { start: { gte: range.start } } : {}),
            ...(range?.end ? { start: { lte: range.end } } : {}),
            registrationMode: RegistrationMode.STRIPE,
          },
          status: { not: RegistrationStatus.CANCELLED },
        },
      });
      const checkins = await prisma.eventRegistration.count({
        where: {
          event: {
            eventTemplate: {
              ...(tenantId ? { tenantId } : {}),
            },
            excludeFromStatistics: false,
            ...(range?.start ? { start: { gte: range.start } } : {}),
            ...(range?.end ? { start: { lte: range.end } } : {}),
          },
          status: { not: RegistrationStatus.CANCELLED },
          checkInTime: { not: null },
        },
      });
      const totalEvents = await prisma.tumiEvent.count({
        where: {
          eventTemplate: {
            ...(tenantId ? { tenantId } : {}),
          },
          excludeFromStatistics: false,
          ...(range?.start ? { start: { gte: range.start } } : {}),
          ...(range?.end ? { start: { lte: range.end } } : {}),
        },
      });
      const paidEvents = await prisma.tumiEvent.count({
        where: {
          eventTemplate: {
            ...(tenantId ? { tenantId } : {}),
          },
          excludeFromStatistics: false,
          ...(range?.start ? { start: { gte: range.start } } : {}),
          ...(range?.end ? { start: { lte: range.end } } : {}),
          registrationMode: RegistrationMode.STRIPE,
        },
      });
      const userEventDistribution = await prisma.user
        .findMany({
          where: {
            tenants: {
              some: {
                ...(tenantId ? { tenantId } : {}),
              },
            },
            eventRegistrations: {
              some: {
                event: {
                  ...(range?.start ? { start: { gte: range.start } } : {}),
                  ...(range?.end ? { start: { lte: range.end } } : {}),
                  excludeFromStatistics: false,
                  registrationMode: RegistrationMode.STRIPE,
                },
              },
            },
          },
          include: {
            eventRegistrations: {
              where: {
                status: { not: RegistrationStatus.CANCELLED },
                event: {
                  eventTemplate: {
                    ...(tenantId ? { tenantId } : {}),
                  },
                  registrationMode: RegistrationMode.STRIPE,
                  excludeFromStatistics: false,
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
            (result: { name: string; value: any }[], value: any, events: any) =>
              result.push({ name: `${String(events)} events`, value }),
            []
          );
        });
      const userUniversityDistribution = await prisma.user
        .groupBy({
          where: {
            tenants: {
              some: {
                ...(tenantId ? { tenantId } : {}),
              },
            },
            ...(range?.start ? { createdAt: { gte: range.start } } : {}),
            ...(range?.end ? { createdAt: { lte: range.end } } : {}),
          },
          by: ['university'],
          _count: { university: true },
        })
        .then((res) =>
          res.map((entry) => ({
            uni: entry.university,
            count: entry._count.university,
          }))
        );
      const userStatusDistribution = await prisma.user
        .groupBy({
          where: {
            tenants: {
              some: {
                ...(tenantId ? { tenantId } : {}),
              },
            },
            ...(range?.start ? { createdAt: { gte: range.start } } : {}),
            ...(range?.end ? { createdAt: { lte: range.end } } : {}),
          },
          by: ['enrolmentStatus'],
          _count: { enrolmentStatus: true },
        })
        .then((res) =>
          res.map((entry) => ({
            status: entry.enrolmentStatus,
            count: entry._count.enrolmentStatus,
          }))
        );
      const userHistory = await prisma.usersOfTenants
        .findMany({
          where: {
            ...(tenantId ? { tenantId } : {}),
            ...(range?.start ? { createdAt: { gte: range.start } } : {}),
            ...(range?.end ? { createdAt: { lte: range.end } } : {}),
          },
          orderBy: { createdAt: 'asc' },
        })
        .then(convertToSeries('New Users'));
      const registrationHistory = await prisma.eventRegistration
        .findMany({
          where: {
            event: {
              eventTemplate: {
                ...(tenantId ? { tenantId } : {}),
              },
              ...(range?.start ? { start: { gte: range.start } } : {}),
              ...(range?.end ? { start: { lte: range.end } } : {}),
              excludeFromStatistics: false,
            },
            status: { not: RegistrationStatus.CANCELLED },
          },
          orderBy: { createdAt: 'asc' },
        })
        .then(convertToSeries('New Registrations'));
      const checkinHistory = await prisma.eventRegistration
        .findMany({
          where: {
            event: {
              eventTemplate: {
                ...(tenantId ? { tenantId } : {}),
              },
              ...(range?.start ? { start: { gte: range.start } } : {}),
              ...(range?.end ? { start: { lte: range.end } } : {}),
              excludeFromStatistics: false,
            },
            status: { not: RegistrationStatus.CANCELLED },
            checkInTime: { not: null },
          },
          orderBy: { checkInTime: 'asc' },
        })
        .then(convertToSeries('New Checkins', 'checkInTime'));
      return {
        usersRegistered,
        usersWithCustomer,
        usersWithPaymentMethod,
        registrations,
        usersRegisteredEvents,
        usersRegisteredFreeEvents,
        usersRegisteredPaidEvents,
        paidRegistrations,
        checkins,
        totalEvents,
        paidEvents,
        userEventDistribution,
        userUniversityDistribution,
        userStatusDistribution,
        userHistory,
        registrationHistory,
        checkinHistory,
      };
    },
  }),
}));
