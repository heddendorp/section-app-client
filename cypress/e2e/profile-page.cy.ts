import { users } from '../../server/prisma/constants';

describe('The Profile Page', () => {
  beforeEach(() => {
    cy.loginByAuth0Api(users.regularUser);
    cy.visit('/profile');
  });
  it('should show the user name', () => {
    cy.get('app-profile-page').contains(
      `${users.regularUser.firstName} ${users.regularUser.lastName}`
    );
  });
});
