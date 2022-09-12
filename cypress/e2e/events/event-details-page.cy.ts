import { events, seedIds, users } from '../../../server/prisma/constants';

describe('The event details page', () => {
  context('when the user is not logged in', () => {
    beforeEach(() => {
      cy.visit(`/events/${events.stripeEvent.id}`);
      cy.waitForLoad();
    });
    it('should show the event title', () => {
      cy.get('app-event-header').contains(events.stripeEvent.title);
    });
    it('should show the event description', () => {
      cy.get('app-event-details-page').contains('Description');
      cy.get('app-event-details-page').contains(events.stripeEvent.description);
      cy.percySnapshot('Event Details Page');
    });
    it('should not show the info for participants', () => {
      cy.get('app-event-details-page')
        .contains('Info for participants')
        .should('not.exist');
    });
    it('should not show the manage button', () => {
      cy.get('[routerlink="manage"]').should('not.exist');
    });
    it('should not show the edit button', () => {
      cy.get('[routerlink="edit"]').should('not.exist');
    });
  });
  context('when the user is an admin', () => {
    beforeEach(() => {
      cy.loginByAuth0Api(users.adminUser);
      cy.visit(`/events/${events.stripeEvent.id}`);
      cy.waitForLoad();
    });
    it('should show the event title', () => {
      cy.get('app-event-header').contains(events.stripeEvent.title);
    });
    it('should show the event description', () => {
      cy.get('app-event-details-page').contains('Description');
      cy.get('app-event-details-page').contains(events.stripeEvent.description);
    });
    it('should show the info for participants', () => {
      cy.get('app-event-details-page')
        .contains('Info for participants')
        .should('be.visible');
    });
    it('should show the manage button', () => {
      cy.get('[routerlink="manage"]').should('be.visible');
    });
    it('should show the edit button', () => {
      cy.get('[routerlink="edit"]').should('be.visible');
    });
  });
});
