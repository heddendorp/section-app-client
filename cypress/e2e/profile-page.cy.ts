import { users } from '../../server/prisma/constants';

describe('The Profile Page', () => {
  beforeEach(() => {
    cy.loginByAuth0Api(users.regularUser);
    cy.visit('/profile');
    cy.waitForLoad();
  });
  it('should show the user name', () => {
    cy.get('app-profile-page').contains(
      `${users.regularUser.firstName} ${users.regularUser.lastName}`
    );
  });
  it('should show the user image', () => {
    cy.get('[data-testid="profile-picture"]').should('be.visible');
    cy.wait(500);
    cy.percySnapshot('Profile Page');
  });
});
