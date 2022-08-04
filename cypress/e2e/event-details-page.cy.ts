import { seedIds } from '../../server/prisma/ids';

describe('The event details page', () => {
  beforeEach(() => {
    cy.visit(`/events/${seedIds.testEvent}`);
  });
  it('should show the event title', () => {
    cy.get('app-event-header').contains('Test Event');
  });
  it('should show the event description', () => {
    cy.get('app-event-details-page').contains('Description');
    cy.get('app-event-details-page').contains('This is a test event');
  });
});
