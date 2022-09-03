import { events, seedIds, users } from '../../../server/prisma/constants';
before(() => {
  cy.exec('docker compose exec server yarn prisma:reset-test -d');
});
describe('Event Participant Registration', () => {
  context('when user is not logged in', () => {
    it('should recommend to log in', () => {
      cy.visit('/');
      cy.waitForLoad();
      cy.get('app-events-list-item').contains('Paid Event').click();
      cy.get('[data-testid="event-signup-section"]').contains(
        'To sign up for events, please log in or create an account.'
      );
      cy.get('a').contains('Log in').click();
    });
  });
  context('when user is logged in', () => {
    beforeEach(() => {
      cy.loginByAuth0Api(users.regularUser);
      cy.visit(`/events/${events.paidEvent.id}`);
      cy.waitForLoad();
    });
    it('should offer to register', () => {
      cy.get('[data-testid="event-signup-section"]').contains(
        'You can register for this event'
      );
      cy.get('[data-testid="event-signup-section"]')
        .contains('Start payment and register')
        .click();
      cy.origin('https://stripe.com', { args: {} }, () => {
        cy.wait(10000);
      });
    });
  });
});
