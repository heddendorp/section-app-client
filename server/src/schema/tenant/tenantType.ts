import { DateTime } from 'luxon';
import { builder } from '../../builder';
import prisma from '../../client';
import {
  MembershipStatus,
  PublicationState,
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
      resolve: async (tenant, args, context) => {
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
              lastName: 'asc',
            },
          },
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
        const birthdayArray: any[] = [];
        birthDayMap.forEach((users, birthday: string) => {
          if (users.length > 0) {
            birthdayArray.push({
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

        const newEvents = await prisma.tumiEvent.findMany({
          where: {
            publicationState: { not: PublicationState.DRAFT },
            eventTemplate: {
              tenantId: tenant.id,
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
          select: {
            id: true,
            icon: true,
            title: true,
            start: true,
            end: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
              },
            },
          },
        });

        return {
          activeOrganizers,
          usersWithPositions,
          newEvents,
          birthdays: birthdayArray,
        } as any;
      },
    }),

    tutorHubEvents: t.field({
      type: 'JSON',
      args: {
        range: t.arg({ type: dateRangeInputType }),
      },
      resolve: async (root, { range }, context, info) => {
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
            publicationState: { not: PublicationState.DRAFT },
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
              publicationState: { not: PublicationState.DRAFT },
            },
            status: RegistrationStatus.SUCCESSFUL,
          },
        });

        const organizerLeaderboard = await Promise.all(
          (
            await prisma.eventRegistration.groupBy({
              by: ['userId'],
              where: {
                type: RegistrationType.ORGANIZER,
                status: RegistrationStatus.SUCCESSFUL,
                event: {
                  eventTemplate: {
                    tenantId: context.tenant.id,
                  },
                  excludeFromStatistics: false,
                  start: rangeQuery,
                },
              },
              _count: { id: true },
              take: 30,
              orderBy: {
                _count: {
                  id: 'desc',
                },
              },
            })
          ).map(async (agg) => {
            return {
              count: agg._count.id,
              ...(await prisma.usersOfTenants.findFirst({
                where: {
                  tenantId: context.tenant.id,
                  user: { id: agg.userId },
                },
                select: {
                  status: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      picture: true,
                    },
                  },
                },
              })),
            };
          })
        );

        const creatorLeaderboard = await Promise.all(
          (
            await prisma.tumiEvent.groupBy({
              by: ['creatorId'],
              where: {
                eventTemplate: {
                  tenantId: context.tenant.id,
                },
                excludeFromStatistics: false,
                start: rangeQuery,
              },
              _count: { id: true },
              take: 30,
              orderBy: {
                _count: {
                  id: 'desc',
                },
              },
            })
          ).map(async (agg) => {
            return {
              count: agg._count.id,
              ...(await prisma.usersOfTenants.findFirst({
                where: {
                  tenantId: context.tenant.id,
                  user: { id: agg.creatorId },
                },
                select: {
                  status: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      picture: true,
                    },
                  },
                },
              })),
            };
          })
        );

        const addRanking = (leaderboard: any[]): any[] => {
          return leaderboard.map((entry) => {
            return {
              ...entry,
              rank: `${
                leaderboard.findIndex(
                  (compare) => compare.count === entry.count
                ) + 1
              }${
                leaderboard.filter((compare) => compare.count === entry.count)
                  .length > 1
                  ? '='
                  : '.'
              }`,
            };
          });
        };

        return {
          registrationCount,
          eventCount,
          organizerLeaderboard: addRanking(organizerLeaderboard),
          creatorLeaderboard: addRanking(creatorLeaderboard),
        } as any;
      },
    }),
  }),
});
