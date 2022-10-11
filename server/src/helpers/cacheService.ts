import { createClient, RedisClientType } from 'redis';
import { Context } from '../builder';
import { MembershipStatus, Tenant } from '../generated/prisma';
import prisma from '../client';

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
