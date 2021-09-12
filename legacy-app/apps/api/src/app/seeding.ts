import { MembershipStatus, PrismaClient, Role } from '@tumi/server-models';

export async function seedDB(prisma: PrismaClient) {
  const tenant = await prisma.tenant.upsert({
    where: {
      shortName: 'tumi',
    },
    update: {},
    create: {
      name: 'ESN TUMi e.V.',
      shortName: 'tumi',
    },
  });
  const user = await prisma.user.upsert({
    where: {
      authId: 'google-oauth2|110521442319435018423',
    },
    update: {},
    create: {
      authId: 'google-oauth2|110521442319435018423',
      firstName: 'Lukas',
      lastName: 'Heddendorp',
      email: 'lu.heddendorp@gmail.com',
      birthdate: new Date('1996-10-20T22:00:00.000Z'),
      tenants: {
        create: {
          status: MembershipStatus.FULL,
          role: Role.ADMIN,
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
        },
      },
    },
  });
}
