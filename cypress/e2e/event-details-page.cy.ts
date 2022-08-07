import { seedIds } from '../../server/prisma/constants';

describe('The event details page', () => {
  context('when the user is not logged in', () => {
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
    it('should not show the info for participants', () => {
      cy.get('app-event-details-page')
        .contains('Info for participants')
        .should('not.be.visible');
    });
  });
});
