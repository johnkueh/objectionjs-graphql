Cypress.Commands.add('deleteUser', email => {
  return cy.task('deleteUser', email);
});

Cypress.Commands.add('factory', args => {
  return cy.task('factory', args);
});

Cypress.Commands.add('createUserAndLogin', args => {
  cy.task('factory', {
    method: 'create',
    type: 'user',
    args,
    include: ['jwt']
  }).then(user => {
    cy.setCookie('jwt', user.jwt);
    cy.wrap(user);
  });
});

Cypress.Commands.add('createUserWithWorkspacesAndLogin', args => {
  cy.task('factory', {
    method: 'create',
    type: 'userWithWorkspace',
    args,
    include: ['jwt', 'workspaces']
  }).then(user => {
    cy.setCookie('jwt', user.jwt);
    cy.wrap(user);
  });
});
