import { seedIds } from '../../server/prisma/constants';

describe('The Events Page', () => {
  beforeEach(() => {
    cy.visit('/events');
    cy.waitForLoad();
  });
  context('when the user is not logged in', () => {
    it('successfully loads', () => {
      cy.get('app-event-list-page').should('exist');
    });
    it('shows the Test Event', () => {
      cy.get('app-events-list-item').contains('Test Event');
      cy.percySnapshot();
    });
    it('should allow navigating to the test event', () => {
      cy.get('app-events-list-item').contains('Test Event').click();
      cy.url().should('include', seedIds.testEvent);
    });
    it('does not show the create event button', () => {
      cy.get('a').contains('Add Event').should('not.exist');
    });
  });
});
