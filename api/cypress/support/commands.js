Cypress.Commands.add('deleteUser', email => {
  return cy.task('deleteUser', email);
});

Cypress.Commands.add('factoryCreate', params => {
  return cy.task('factoryCreate', params);
});
