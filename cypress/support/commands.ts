/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('waitForLoad', () => {
  cy.get('mat-progress-bar', { timeout: 15000 }).should('not.exist');
});

Cypress.Commands.add('seedDB', () => {
  if(Cypress.env('dev')){
    cy.exec('yarn workspace @tumi/server prisma:seed-dev');
  } else {
    cy.exec('docker compose exec -w /usr/src/app server yarn prisma:seed-test');
  }
});

Cypress.Commands.add(
  'loginByAuth0Api',
  (args: { email: string; password: string }) => {
    cy.session(
      args,
      () => {
        cy.visit('/');
        cy.get('button').contains('Log in').click();
        cy.origin(
          'https://tumi.eu.auth0.com',
          { args },
          ({ email, password }) => {
            // cy.reload();
            cy.get('#username').type(email);
            cy.contains('Continue').click();
            cy.get('#password').type(password);
            cy.on('uncaught:exception', (err) => {
              return false;
            });
            cy.contains('Continue').click();
            cy.wait(500);
            cy.url().then((url) => {
              if (url.includes('https://tumi.eu.auth0.com')) {
                cy.contains('Not now').click();
              }
            });
          }
        );
      },
      {
        validate() {
          cy.reload();
          cy.visit('/');
          cy.wait(500);
          cy.get('[data-testid="profile-link"]', { timeout: 15000 }).should(
            'be.visible'
          );
        },
      }
    );
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      loginByAuth0Api(args: { email: string; password: string }): Chainable;
      waitForLoad(): Chainable;
      seedDB(): Chainable;
    }
  }
}
