import { DateTime } from 'luxon';
import { builder } from '../../builder';
import prisma from '../../client';
import {
  MembershipStatus,
  RegistrationStatus,
  RegistrationType,
} from '../../generated/prisma';
import { dateRangeInputType } from '../helperFunctions';

builder.prismaObject('Tenant', {
  findUnique: (tenant) => ({ id: tenant.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    name: t.exposeString('name'),
    shortName: t.exposeString('shortName'),
    organizers: t.relation('organizers'),
    users: t.relation('users'),
    imprintPage: t.exposeString('imprintPage'),
    privacyPolicyPage: t.exposeString('privacyPolicyPage'),
    aboutPage: t.exposeString('aboutPage'),
    faqPage: t.exposeString('faqPage', { nullable: true }),
    tacPage: t.exposeString('tacPage', { nullable: true }),

    tutorHub: t.field({
      type: 'JSON',
      authScopes: { member: true },
      unauthorizedResolver: () => {},
      resolve: async (query, tenant, args, context) => {
        const activeOrganizerIds = (
          await prisma.eventRegistration.groupBy({
            by: ['userId'],
            where: {
              type: RegistrationType.ORGANIZER,
              status: RegistrationStatus.SUCCESSFUL,
              createdAt: {
                gt: DateTime.now().minus({ months: 3 }).toJSDate(),
              },
            },
            _count: { id: true },
          })
        ).map((u) => u.userId);

        const activeOrganizers = await prisma.usersOfTenants.findMany({
          where: {
            tenantId: tenant.id,
            status: { not: MembershipStatus.NONE },
            user: {
              id: { in: activeOrganizerIds },
            },
          },
          select: {
            status: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
                birthdate: true,
              },
            },
          },
          orderBy: {
            user: {
              lastName: 'asc'
            }
          }
        });

        const now = DateTime.now();
        const birthDayMap: Map<string, any[]> = new Map();
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          birthDayMap.set(now.plus({ days: dayOffset }).toFormat('LLLL d'), []);
        }
        for (const userSelect of activeOrganizers) {
          if (userSelect.user.birthdate) {
            const day = DateTime.fromJSDate(userSelect.user.birthdate).toFormat(
              'LLLL d'
            );
            birthDayMap.get(day)?.push({
              ...userSelect.user,
              status: userSelect.status,
            });
          }
        }
        const outputArray: any[] = [];
        birthDayMap.forEach((users, birthday: string) => {
          if (users.length > 0) {
            outputArray.push({
              birthday,
              users,
            });
          }
        });

        const usersWithPositions = await prisma.usersOfTenants.findMany({
          where: {
            tenantId: tenant.id,
            status: { not: MembershipStatus.NONE },
            user: {
              position: { not: null },
            },
          },
          select: {
            status: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
                birthdate: true,
                position: true,
              },
            },
          },
          orderBy: {
            user: {
              position: 'asc',
            },
          },
        });
        return {
          activeOrganizers,
          usersWithPositions,
          birthdays: outputArray,
        };
      },
    }),
    
    tutorHubEvents: t.field({
      type: 'JSON',
      args: {
        range: t.arg({ type: dateRangeInputType }),
      },
      resolve: async (query, { range }, context, info) => {
        let rangeQuery: { gte?: Date; lte?: Date } = {};
        if (range) {
          if (range.start) {
            rangeQuery = {
              ...rangeQuery,
              gte: range.start,
            };
          }
          if (range.end) {
            rangeQuery = {
              ...rangeQuery,
              lte: range.end,
            };
          }
        }
        const eventCount = await prisma.tumiEvent.count({
          where: {
            eventTemplate: {
              tenantId: context.tenant.id,
            },
            excludeFromStatistics: false,
            start: rangeQuery,
          },
        });
        const registrationCount = await prisma.eventRegistration.count({
          where: {
            event: {
              eventTemplate: {
                tenantId: context.tenant.id,
              },
              excludeFromStatistics: false,
              start: rangeQuery,
            },
            status: RegistrationStatus.SUCCESSFUL,
          },
        });
        const leaderboard;
        return {
          registrationCount,
          eventCount,
        };
      },
    }),
  }),
});
