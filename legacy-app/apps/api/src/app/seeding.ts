import { PrismaClient } from '@tumi/models';

export function seedDB(prisma: PrismaClient) {
  return prisma.tenant.upsert({
    where: {
      shortName: 'tumi',
    },
    update: {},
    create: {
      name: 'ESN TUMi e.V.',
      shortName: 'tumi',
    },
  });
}
