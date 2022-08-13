describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/home');
  });
  it('successfully loads', () => {
    cy.visit('/home');
  });
  it('shows the headline', () => {
    cy.get('h1').contains('Exchange, better!').should('be.visible');
    cy.percySnapshot('Home Page');
  });
});
