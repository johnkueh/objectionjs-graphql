describe('logging in', () => {
  it('with wrong credentials shows error messages', () => {
    cy.visit('/login');

    cy.get('[data-testid=email]').type('wrong@doe.com');
    cy.get('[data-testid=password]').type('testpassword');
    cy.get('[data-testid=submit]').click();

    cy.get('[data-testid="alerts"]').should(
      'contain',
      'Please check your credentials and try again.'
    );
  });

  it('with correct credentials is successful', () => {});
});

describe('signing up', () => {
  it('with invalid fields shows error messages', () => {
    cy.visit('/signup');

    cy.get('[data-testid=submit]').click();
    cy.get('[data-testid="alerts"]').should('contain', 'Name must be at least 1 characters');
    cy.get('[data-testid="alerts"]').should('contain', 'Email must be at least 1 characters');
    cy.get('[data-testid="alerts"]').should('contain', 'Password must be at least 6 characters');

    cy.get('[data-testid=name]').type('John Doe');
    cy.get('[data-testid=email]').type('john@doe');

    cy.get('[data-testid=submit]').click();
    cy.get('[data-testid="alerts"]').should('contain', 'Email must be a valid email');

    cy.get('[data-testid=email]')
      .clear()
      .type('john@doe.com');
    cy.get('[data-testid=password]').type('test');

    cy.get('[data-testid=submit]').click();
    cy.get('[data-testid="alerts"]').should('contain', 'Password must be at least 6 characters');
  });

  it('with valid fields is successful', () => {
    cy.task('deleteUser', 'john@doe.com');
    cy.visit('/signup');

    cy.get('[data-testid=name]').type('John Doe');
    cy.get('[data-testid=email]').type('john@doe.com');
    cy.get('[data-testid=password]').type('testpassword');
    cy.get('[data-testid=submit]').click();
    cy.url().should('include', '/start');
  });
});
