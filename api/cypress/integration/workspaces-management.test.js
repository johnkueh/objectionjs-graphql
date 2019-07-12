describe('managing workspaces', function() {
  beforeEach(function() {
    cy.deleteUser('john@doe.com');
    cy.createUserAndLogin({
      email: 'john@doe.com'
    }).as('user');
  });
  it('can perform CRUD on workspaces', function() {
    // Create
    cy.visit('/workspaces');
    cy.get('[data-testid=workspace-new-button]').click();
    cy.get('[data-testid=workspace-create-form]').should('exist');
    cy.get('[data-testid=workspace-form-submit]').click();
    cy.get('[data-testid=alerts').should('contain', 'Name must be at least 1 character');
    cy.get('input[name=name]').type('A test workspace');
    cy.get('[data-testid=workspace-form-submit]').click();

    // Read
    cy.get('[data-testid=workspace-list]').should('contain', 'A test workspace');

    // Update
    cy.get('[data-testid=workspace-link]')
      .first()
      .click();
    cy.get('[data-testid=workspace-create-form]').should('not.exist');
    cy.get('[data-testid=workspace-edit-form]').should('not.exist');
    cy.get('input[name=name]').clear();
    cy.get('[data-testid=workspace-form-submit]').click();
    cy.get('[data-testid=alerts').should('contain', 'Name must be at least 1 character');
    cy.get('input[name=name]').type('Updated workspace');
    cy.get('[data-testid=workspace-form-submit]').click();
    cy.get('[data-testid=workspace-list]').should('contain', 'Updated workspace');

    // Destroy
    cy.get('[data-testid=workspace-link]')
      .first()
      .click();
    cy.get('[data-testid=workspace-delete]').click();
    cy.get('[data-testid=workspace-list]').should('not.contain', 'Updated workspace');
  });
});
