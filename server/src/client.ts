import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  prisma.$use(async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );

    return result;
  });
}
export default prisma;
