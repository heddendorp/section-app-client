/// <reference types="cypress" />
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      loginByAuth0Api(username: string, password: string): Chainable;
      waitForLoad(): Chainable;
    }
  }
}
