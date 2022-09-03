import { seedIds, users } from '../../../../server/prisma/constants';

describe('The event management page', () => {
  context('when the user is an admin', () => {
    beforeEach(() => {
      cy.loginByAuth0Api(users.adminUser);
      cy.visit(`/events/${seedIds.testEvent}/manage`);
      cy.waitForLoad();
    });
    it('should load the event management page', () => {
      cy.get('app-event-manage-page').should('exist');
    });
    it('should allow to update the cost finances', () => {
      cy.get('app-event-manage-page').contains('Update from template').click();
      cy.get('app-event-manage-page')
        .contains('Basic-Paket + Extrakugeln + Anmeldegebühr')
        .should('be.visible');
    });
  });
});
