import { createClient, RedisClientType } from 'redis';
import { Context } from '../builder';
import {
  MembershipStatus,
  RegistrationStatus,
  RegistrationType,
  Tenant,
} from '../generated/prisma';
import prisma from '../client';
import { DateTime } from 'luxon';

class CacheService {
  private client: RedisClientType;
  private redisError: Error | null = null;
  private cacheReady: Promise<void>;

  constructor() {
    if (process.env.AZURE_REDIS_CONNECTIONSTRING) {
      this.client = createClient({
        url: process.env.AZURE_REDIS_CONNECTIONSTRING,
      });
      this.client.on('error', (err) => {
        console.log('Redis Client Error', err);
        this.redisError = err;
      });

      this.cacheReady = this.client.connect();
    } else {
      this.client = createClient();
      this.cacheReady = Promise.resolve();
      this.redisError = new Error('No Redis URL');
    }
  }

  public async getTenantFromShortName(shortName: string): Promise<Tenant> {
    if (this.redisError) {
      return prisma.tenant.findUniqueOrThrow({
        where: {
          shortName,
        },
      });
    } else {
      const tenant = await this.client.get(`tenant:${shortName}`);
      if (!tenant) {
        const tenant = await prisma.tenant.findUniqueOrThrow({
          where: {
            shortName,
          },
        });
        await this.client.set(`tenant:${shortName}`, JSON.stringify(tenant), {
          EX: 60 * 60 * 24,
        });
        return tenant;
      }
      return JSON.parse(tenant);
    }
  }

  public async getSignupVelocity(eventId: string) {
    if (this.redisError) {
      return this.calculateSignupVelocity(eventId);
    } else {
      const signupVelocity = await this.client.get(`signupVelocity:${eventId}`);
      if (true) {
        const velocities = await this.calculateSignupVelocity(eventId);
        await this.client.set(
          `signupVelocity:${eventId}`,
          JSON.stringify(velocities),
          { EX: 60 * 60 * 24 }
        );
        return velocities;
      }
      // return JSON.parse(signupVelocity);
    }
  }

  private async calculateSignupVelocity(eventId: string) {
    const event = await prisma.tumiEvent.findUniqueOrThrow({
      where: {
        id: eventId,
      },
    });
    const eventRegistrations = await prisma.eventRegistration.findMany({
      where: {
        event: { id: event.id },
        status: { not: RegistrationStatus.CANCELLED },
        type: RegistrationType.PARTICIPANT,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
      },
    });
    const registrationTimes = eventRegistrations.map(
      (registration) => registration.createdAt
    );
    const maxParticipants = event.participantLimit;
    const registrationStart = event.registrationStart;
    // Crit registration time at 25, 50, 75 and 90 percent of the registrations
    const critUserPercentile = [25, 50, 75, 90];
    const critRegistrationTimes = Array(critUserPercentile.length);
    const timespan = Array(critUserPercentile.length);
    const critUserCount = Array(critUserPercentile.length);
    const registrationStartLuxon = DateTime.fromJSDate(registrationStart);
    for (let i = 0; i < critUserPercentile.length; i++) {
      critUserCount[i] = Math.round(
        (critUserPercentile[i] / 100) * maxParticipants
      );
      critRegistrationTimes[i] = registrationTimes[critUserCount[i] - 1];

      if (!critRegistrationTimes[i]) {
        timespan[i] = null;
      } else {
        const critRegistrationTimeLuxon = DateTime.fromJSDate(
          critRegistrationTimes[i]
        );
        timespan[i] = critRegistrationTimeLuxon.diff(registrationStartLuxon, [
          'hours',
          'minutes',
          'seconds',
        ]);
      }
    }

    return {
      quarter: timespan[0]?.as('hours')
        ? Math.round((critUserCount[0] / timespan[0].as('hours')) * 100) / 100
        : null,
      quarterTime: timespan[0]
        ? `${timespan[0].hours}:${timespan[0].minutes}:${Math.round(
            timespan[0].seconds
          )}h`
        : null,
      quarterCount: critUserCount[0],
      fifty: timespan[1]?.as('hours')
        ? Math.round((critUserCount[1] / timespan[1].as('hours')) * 100) / 100
        : null,
      fiftyTime: timespan[1]?.as('minutes')
        ? `${timespan[1].hours}:${timespan[1].minutes}:${Math.round(
            timespan[1].seconds
          )}h`
        : null,
      fiftyCount: critUserCount[1],
      threequarters: timespan[2]?.as('hours')
        ? Math.round((critUserCount[2] / timespan[2].as('hours')) * 100) / 100
        : null,
      threequartersTime: timespan[2]?.as('minutes')
        ? `${timespan[2].hours}:${timespan[2].minutes}:${Math.round(
            timespan[2].seconds
          )}h`
        : null,
      threequartersCount: critUserCount[2],
      ninety: timespan[3]?.as('hours')
        ? Math.round((critUserCount[3] / timespan[3].as('hours')) * 100) / 100
        : null,
      ninetyTime: timespan[3]?.as('minutes')
        ? `${timespan[3].hours}:${timespan[3].minutes}:${Math.round(
            timespan[3].seconds
          )}h`
        : null,
      ninetyCount: critUserCount[3],
    };
  }

  public async getUserMembershipStatus(
    userId: string,
    context: Context
  ): Promise<MembershipStatus> {
    if (this.redisError) {
      const userMembershipStatus = await prisma.usersOfTenants.findUnique({
        where: {
          userId_tenantId: {
            userId,
            tenantId: context.tenant.id,
          },
        },
      });
      return userMembershipStatus?.status || MembershipStatus.NONE;
    } else {
      const userMembershipStatus = await this.client.get(
        `userMembershipStatus:${userId}:${context.tenant.id}`
      );
      if (!userMembershipStatus) {
        const userOfTenant = await prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId,
              tenantId: context.tenant.id,
            },
          },
        });
        await this.client.set(
          `userMembershipStatus:${userId}:${context.tenant.id}`,
          userOfTenant?.status || MembershipStatus.NONE,
          { EX: 60 * 60 * 24 }
        );
        return userOfTenant?.status || MembershipStatus.NONE;
      }
      return userMembershipStatus as MembershipStatus;
    }
  }
}

const cacheService = new CacheService();
export default cacheService;
