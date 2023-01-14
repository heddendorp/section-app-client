import { users } from "../../../server/prisma/constants";

context('Tenant setup', () => {
    before(() => {
        cy.seedDB();
    });

    beforeEach(() => {
        localStorage.setItem('tenantId', 'test');
    });

    it('should load without events', () => {
        cy.visit('/');
        cy.get('[data-cy=no-events]').should('exist');
    });

    it('should allow new users to sign up', () => {
        cy.loginByAuth0Api(users.unfinishedUser);
        cy.visit('/');
        cy.location('pathname').should('eq', '/profile/new');
        cy.get('[data-cy=university-select]').click();
        cy.get('[data-cy=tum-option]').click();
        cy.get('[data-cy=status-select]').click();
        cy.get('[data-cy=exchange-option]').click();
        cy.get('[data-cy=date-toggle]').click();
        cy.get('.mat-calendar-body-cell').contains('2002').click();
        cy.get('.mat-calendar-body-cell').contains('FEB').click();
        cy.get('.mat-calendar-body-cell').contains('15').click();
        cy.get('[data-cy=phone-input]').type('+123456789');
        cy.get('[data-cy=submit-button]').click();
        cy.location('pathname').should('eq', '/profile');
    });
    context('when the tenant admin is logged in',()=>{
        beforeEach(() => {
            cy.loginByAuth0Api(users.newTenantAdmin);
        });

        it('should allow to add a new organizer', () => {
        });
    })
});