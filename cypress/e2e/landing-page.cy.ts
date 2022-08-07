import { seedIds } from '../../server/prisma/constants';

describe('The Landing Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });
  it('redirects to events', () => {
    cy.visit('/');
    cy.url().should('include', '/events');
  });
  it('shows the Test Event', () => {
    cy.visit('/events');
    cy.get('app-event-list-item').contains('Test Event');
  });
  it('should allow navigating to the test event', () => {
    cy.visit('/events');
    cy.get('app-event-list-item').contains('Test Event').click();
    cy.url().should('include', seedIds.testEvent);
  });
});
