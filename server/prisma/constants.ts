import { faker } from '@faker-js/faker';

export const seedIds = {
  testEvent: 'c8d54510-ecb1-4ccf-944e-1d80e7b5e6ca',
  freeEvent: 'c116ac1e-57bc-4ad6-bc0d-5a68a23e5ab0',
};

export const templates = {
  testTemplate: {
    id: '2261485d-0944-427b-8783-d05943721b36',
    comment: 'This is a test template',
    description: 'This is a test template',
    organizerText: 'This is a test template',
    participantText: 'This is a test template',
    title: 'Test Event',
    icon: 'test-tube',
    location: faker.address.nearbyGPSCoordinate().join(','),
  },
  secondTemplate: {
    id: '7a6971bc-bd56-47b5-babd-8606737f1ae9',
    comment: 'This is a second template',
    description: 'This is a second template',
    organizerText: 'This is a second template',
    participantText: 'This is a second template',
    title: 'Second Template',
  },
  paidTemplate: {
    id: 'c58ce57b-0e91-4e14-ba24-43121937d8fd',
    comment: 'This is a template for a paid event',
    description: 'This is a testing event that costs money',
    organizerText: 'Organizer text',
    participantText: 'Participant text',
    title: 'Paid Event',
    icon: 'money',
    location: faker.address.nearbyGPSCoordinate().join(','),
  },
};

export const events = {
  paidEvent: {
    description: templates.paidTemplate.description,
    organizerText: templates.paidTemplate.organizerText,
    participantText: templates.paidTemplate.participantText,
    title: templates.paidTemplate.title,
    icon: templates.paidTemplate.icon,
    location: templates.paidTemplate.location,
    id: '804b5fd7-42b8-425c-938b-1f3695d0c5b5',
  },
  paidEvent2: {
    description: templates.paidTemplate.description,
    organizerText: templates.paidTemplate.organizerText,
    participantText: templates.paidTemplate.participantText,
    title: templates.paidTemplate.title + ' 2',
    icon: templates.paidTemplate.icon,
    location: templates.paidTemplate.location,
    id: '804b5fd7-42b8-425c-938b-1f3695d0c5b6',
  },
  stripeEvent: {
    description: templates.testTemplate.description,
    organizerText: templates.testTemplate.organizerText,
    participantText: templates.testTemplate.participantText,
    title: templates.testTemplate.title,
    icon: templates.testTemplate.icon,
    location: templates.testTemplate.location,
    id: 'c8d54510-ecb1-4ccf-944e-1d80e7b5e6ca',
  },
};

export const users = {
  adminUser: {
    email: 'test1@esn.world',
    password: 'testuser1!',
    firstName: 'Test',
    lastName: 'Admin',
  },
  memberUser: {
    email: 'test2@esn.world',
    password: 'testuser2!',
    firstName: 'Test',
    lastName: 'Member',
  },
  regularUser: {
    email: 'test3@esn.world',
    password: 'testuser3!',
    firstName: 'Test',
    lastName: 'User 3',
  },
  regularUser2: {
    email: 'test5@esn.world',
    password: 'testuser5!',
    firstName: 'Test',
    lastName: 'User 5',
  },
  unfinishedUser: {
    email: 'test4@esn.world',
    password: 'testuser4!',
  },
};

export const cards = {
  visa: {
    number: '4242424242424242',
    cvc: '123',
  },
};
