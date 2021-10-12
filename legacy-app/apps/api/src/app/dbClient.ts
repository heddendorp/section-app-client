import { PrismaClient } from '@tumi/server-models';
import io = require('@pm2/io');

const currentQueries = io.counter({
  name: 'Realtime query count',
  id: 'app/realtime/queries',
});

const queryDuration = io.metric({
  name: 'Query Duration',
  id: 'app/realtime/queryDuration',
});

class DBClient {
  public prisma: PrismaClient;
  private static instance: DBClient;
  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$use(async (params, next) => {
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
    });
  }

  public static getInstance = () => {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  };
}

export default DBClient;
