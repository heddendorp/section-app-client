import {
  PrismaClient,
  Role,
  MembershipStatus,
  RegistrationMode,
  PublicationState,
} from '../src/generated/prisma';
import { faker } from '@faker-js/faker';
import { seedIds, templates, users } from './constants';

const prisma = new PrismaClient();

async function runSeed() {
  const tumiTenant = await prisma.tenant.create({
    data: {
      name: 'ESN TUMi e.V.',
      shortName: 'tumi',
    },
  });

  const tumiOrganizer = await prisma.eventOrganizer.create({
    data: {
      name: 'ESN TUMi e.V.',
      tenant: { connect: { id: tumiTenant.id } },
      text: 'text',
    },
  });

  const testTenant = await prisma.tenant.create({
    data: {
      name: 'ESN Test',
      shortName: 'test',
    },
  });

  /**
   * Test user also available in auth0
   * password: testuser1!
   */
  const adminUser = await prisma.user.create({
    data: {
      authId: 'auth0|6231e525fa8b3b00698092a8',
      email: users.adminUser.email,
      email_verified: true,
      firstName: users.adminUser.firstName,
      lastName: users.adminUser.lastName,
      picture: faker.internet.avatar(),
      university: 'tum',
      enrolmentStatus: 'LOCAL',
      birthdate: faker.date.birthdate(),
    },
  });

  await prisma.usersOfTenants.create({
    data: {
      role: Role.ADMIN,
      status: MembershipStatus.FULL,
      tenant: { connect: { id: tumiTenant.id } },
      user: { connect: { id: adminUser.id } },
    },
  });

  /**
   * Test user also available in auth0
   * password: testuser2!
   */
  const memberUser = await prisma.user.create({
    data: {
      authId: 'auth0|6231e55d5fb02e006980888a',
      email: users.memberUser.email,
      email_verified: true,
      firstName: users.memberUser.firstName,
      lastName: users.memberUser.lastName,
      picture: faker.internet.avatar(),
      university: 'tum',
      enrolmentStatus: 'LOCAL',
      birthdate: faker.date.birthdate(),
    },
  });

  await prisma.usersOfTenants.create({
    data: {
      role: Role.USER,
      status: MembershipStatus.FULL,
      tenant: { connect: { id: tumiTenant.id } },
      user: { connect: { id: memberUser.id } },
    },
  });

  /**
   * Test user also available in auth0
   * password: testuser3!
   */
  const regularUser = await prisma.user.create({
    data: {
      authId: 'auth0|6231e56f989f180070ddff85',
      email: users.regularUser.email,
      email_verified: true,
      firstName: users.regularUser.firstName,
      lastName: users.regularUser.lastName,
      picture: faker.internet.avatar(),
      university: 'tum',
      enrolmentStatus: 'EXCHANGE',
      birthdate: faker.date.birthdate(),
    },
  });
  await prisma.usersOfTenants.create({
    data: {
      role: Role.USER,
      status: MembershipStatus.NONE,
      tenant: { connect: { id: tumiTenant.id } },
      user: { connect: { id: regularUser.id } },
    },
  });

  /**
   * Test user also available in auth0
   * password: testuser4!
   */
  const unfinishedUser = await prisma.user.create({
    data: {
      authId: 'auth0|6231ed02c45d1100696d2a10',
      email: 'test4@esn.world',
      email_verified: true,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      picture: faker.internet.avatar(),
    },
  });
  await prisma.usersOfTenants.create({
    data: {
      role: Role.USER,
      status: MembershipStatus.NONE,
      tenant: { connect: { id: tumiTenant.id } },
      user: { connect: { id: unfinishedUser.id } },
    },
  });

  const testTemplate = await prisma.eventTemplate.create({
    data: {
      ...templates.testTemplate,
      duration: 60,
      finances: {
        items: [
          {
            type: 'participant',
            value: 33,
            details: '',
            prepaid: false,
            description: 'Basic-Paket + Extrakugeln + Anmeldegebühr',
          },
        ],
      },
      icon: 'test-tube',
      location: faker.address.nearbyGPSCoordinate().join(','),
      tenant: { connect: { id: tumiTenant.id } },
    },
  });

  await prisma.eventTemplate.create({
    data: {
      ...templates.secondTemplate,
      duration: 60,
      finances: {},
      icon: 'test-tube',
      location: faker.address.nearbyGPSCoordinate().join(','),
      tenant: { connect: { id: tumiTenant.id } },
    },
  });

  const startDate = faker.date.soon(10);
  await prisma.tumiEvent.create({
    data: {
      createdBy: { connect: { id: adminUser.id } },
      description: 'This is a test event',
      end: faker.date.soon(1, startDate.toString()),
      eventTemplate: { connect: { id: testTemplate.id } },
      icon: 'test-tube',
      location: faker.address.nearbyGPSCoordinate().join(','),
      organizer: { connect: { id: tumiOrganizer.id } },
      organizerText: 'This is a test event',
      participantText: 'This is a test event',
      registrationMode: RegistrationMode.STRIPE,
      start: startDate,
      title: 'Internal draft Event',
    },
  });
  const stripeEvent = await prisma.tumiEvent.create({
    data: {
      id: seedIds.testEvent,
      createdBy: { connect: { id: adminUser.id } },
      description: 'This is a test event',
      end: faker.date.soon(1, startDate.toString()),
      eventTemplate: { connect: { id: testTemplate.id } },
      icon: 'test-tube',
      location: faker.address.nearbyGPSCoordinate().join(','),
      organizer: { connect: { id: tumiOrganizer.id } },
      organizerText: 'This is a test event',
      participantText: 'This is a test event',
      registrationMode: RegistrationMode.STRIPE,
      start: startDate,
      title: 'Stripe Event',
      publicationState: PublicationState.PUBLIC,
      participantSignup: [MembershipStatus.NONE, MembershipStatus.FULL],
    },
  });
  const freeEvent = await prisma.tumiEvent.create({
    data: {
      id: seedIds.freeEvent,
      createdBy: { connect: { id: adminUser.id } },
      description: 'This is a test event',
      end: faker.date.soon(1, startDate.toString()),
      eventTemplate: { connect: { id: testTemplate.id } },
      icon: 'test-tube',
      location: faker.address.nearbyGPSCoordinate().join(','),
      organizer: { connect: { id: tumiOrganizer.id } },
      organizerText: 'This is a test event',
      participantText: 'This is a test event',
      registrationMode: RegistrationMode.ONLINE,
      start: startDate,
      title: 'Test Event',
      publicationState: PublicationState.PUBLIC,
      participantSignup: [MembershipStatus.NONE, MembershipStatus.FULL],
    },
  });
}

runSeed().then(() => {
  console.log('Seeding done');
});
