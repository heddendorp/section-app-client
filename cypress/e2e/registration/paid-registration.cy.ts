import { cards, events, users } from '../../../server/prisma/constants';

before(() => {
  cy.exec('docker compose exec -w /usr/src/app server yarn prisma:seed-test');
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
      // cy.wait(5000);
      cy.origin('https://checkout.stripe.com', { args: cards }, ({ visa }) => {
        cy.on('uncaught:exception', (err) => {
          console.log(err);
          return false;
        });
        cy.get('#cardNumber').type(visa.number);
        cy.get('#cardExpiry').type(
          `${new Date().getMonth() + 2}/${new Date()
            .getFullYear()
            .toString()
            .slice(2)}`
        );
        cy.get('#cardCvc').type(visa.cvc);
        cy.get('#billingName').type('test user');
        cy.get('[data-testid="hosted-payment-submit-button"]').click();
        cy.get('[data-testid="hosted-payment-submit-button"]')
          .contains('Processing', { timeout: 15000 })
          .should('not.exist');
      });
      cy.get('[data-testid="event-signup-section"]', {
        timeout: 15000,
      });
      cy.get('[data-testid="event-signup-section"]').contains(
        'You have a spot on this event'
      );
    });
  });
});
