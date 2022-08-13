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
      it('should show the menu', () => {
        cy.get('[data-testid="navigation"]').should('be.visible');
      });
      it('should show the events menu item', () => {
        cy.get('[data-testid="events-nav-item"]').should('be.visible');
      });
      it('should not show text in the events menu item', () => {
        cy.get('[data-testid="events-nav-item"]')
          .contains('Events')
          .should('not.be.visible');
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
        cy.get('[data-testid="navigation"]').should('be.visible');
      });
      it('should show the events menu item', () => {
        cy.get('[data-testid="events-nav-item"]').should('be.visible');
      });
      it('should show text in the events menu item', () => {
        cy.get('[data-testid="events-nav-item"]')
          .contains('Events')
          .should('be.visible');
      });
    });
  });
});
