import { users } from '../../server/prisma/constants';

describe('the templates page', () => {
  context('when the user is not logged in', () => {
    it('does not load the templates page', () => {
      cy.visit('/event-templates');
      cy.get('app-template-list-page').should('not.exist');
    });
  });
  context('when the user is logged in as a student', () => {
    beforeEach(() => {
      cy.loginByAuth0Api(users.regularUser);
      cy.wait(1000);
    });
    // it('does not load the templates page', () => {
    //   cy.visit('/event-templates');
    //   cy.get('app-template-list-page').should('not.exist');
    // });
  });
  context('when the user is logged in as a member', () => {
    beforeEach(() => {
      cy.loginByAuth0Api(users.memberUser);
      cy.wait(1000);
      cy.visit('/event-templates');
    });
    it('loads the template page', () => {
      cy.get('app-template-list-page').should('exist');
    });
    it('does not show the create template button', () => {
      cy.get('app-template-list-page')
        .contains('Add new Template')
        .should('not.exist');
    });
  });
  context('when the user is logged in as an admin', () => {
    beforeEach(() => {
      cy.loginByAuth0Api(users.adminUser);
      cy.wait(1000);
      cy.visit('/event-templates');
    });
    it('loads the template page', () => {
      cy.get('app-template-list-page').should('exist');
    });
    it('shows the create template button', () => {
      cy.get('app-template-list-page').contains('Add new template');
    });
  });
});
