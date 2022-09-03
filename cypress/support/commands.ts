/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('waitForLoad', () => {
  cy.get('mat-progress-bar', { timeout: 15000 }).should('not.exist');
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
