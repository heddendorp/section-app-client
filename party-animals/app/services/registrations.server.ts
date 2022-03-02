import { PrismaClient, Registration } from '~/generated/prisma';

const prisma = new PrismaClient();

export async function createRegistration(
  data: FormData
): Promise<[{ [key: string]: string }, Registration | null]> {
  return [{}, null];
}
