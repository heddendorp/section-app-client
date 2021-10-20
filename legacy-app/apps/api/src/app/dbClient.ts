import { PrismaClient } from '@tumi/server-models';
import * as LRU from 'lru-cache';
import io = require('@pm2/io');

const currentQueries = io.counter({
  name: 'Realtime query count',
  id: 'app/realtime/queries',
});

const queryDuration = io.metric({
  name: 'Query Duration',
  id: 'app/realtime/queryDuration',
});

const cacheHits = io.meter({
  name: 'cache/sec',
  id: 'app/cache/hits',
});

const queryCache = new LRU(100);

const loggingMiddleware = async (params, next) => {
  currentQueries.inc();
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  queryDuration.set(after - before);
  currentQueries.dec();
  if (process.env.DEV) {
    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );
  }
  return result;
};

const cachingMiddleware = async (params, next) => {
  let result;
  if (
    (params.model === 'EventRegistration' && params.action === 'aggregate') ||
    (['User', 'UsersOfTenants'].includes(params.model) &&
      params.action === 'findUnique') ||
    (params.model === 'Tenant' && params.action === 'findFirst')
  ) {
    const args = JSON.stringify(params.args);
    const cacheKey = `${params.model}_${params.action}_${args}`;
    result = queryCache.get(cacheKey);

    if (result === undefined) {
      result = await next(params);
      const ttl = params.model === 'EventRegistration' ? 5000 : 20000;
      queryCache.set(cacheKey, result, ttl);
    } else {
      if (process.env.DEV) {
        console.log(
          `Cache hit for ${params.model}.${params.action}: ${cacheKey}`
        );
      }
      cacheHits.mark();
    }
  } else {
    result = await next(params);
  }
  return result;
};

class DBClient {
  public prisma: PrismaClient;
  private static instance: DBClient;
  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$use(loggingMiddleware);
    this.prisma.$use(cachingMiddleware);
  }

  public static getInstance = () => {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  };
}

export default DBClient;
