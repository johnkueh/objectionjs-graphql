Cypress.Commands.add('deleteUser', email => {
  return cy.task('deleteUser', email);
});
