import { seedIds } from '../../server/prisma/constants';

describe('The Landing Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });
  it('redirects to events', () => {
    cy.visit('/');
    cy.url().should('include', '/events');
  });
});
