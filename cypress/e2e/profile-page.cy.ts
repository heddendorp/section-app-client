describe('The Profile Page', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('test1@esn.world', 'testuser1!');
    cy.visit('/');
  });
  it('should show the user name', () => {
    cy.get('app-profile-page').contains('Test User');
  });
});
