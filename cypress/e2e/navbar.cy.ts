describe('navbar', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  context('when the user is not logged in', () => {
    context('when the user is on a phone', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');
      });
      it('should show the login button', () => {
        cy.get('app-auth-button').contains('Log in').should('be.visible');
      });
      it('should show the menu button', () => {
        cy.get('.mat-toolbar > .flex-row > .mat-icon-button').should(
          'be.visible'
        );
      });
      it('should show the menu', () => {
        cy.get('.mat-toolbar > .flex-row > .mat-icon-button').click();
        cy.get('.mat-nav-list').should('be.visible');
      });
    });
    context('when the user is on a laptop', () => {
      beforeEach(() => {
        cy.viewport('macbook-15');
      });
      it('should show the login button', () => {
        cy.get('app-auth-button').contains('Log in').should('be.visible');
      });
      it('should show the menu', () => {
        cy.get('.mat-nav-list').should('be.visible');
      });
      it('should show the menu button', () => {
        cy.get('.mat-toolbar > .flex-row > .mat-icon-button').should(
          'be.visible'
        );
      });
      it('should hide the menu when pressing the button', () => {
        cy.get('.mat-toolbar > .flex-row > .mat-icon-button').click();
        cy.get('.mat-nav-list').should('not.be.visible');
      });
    });
  });
});
