describe('logging in', function() {
  beforeEach(function() {
    cy.task('deleteUser', 'john@doe.com');
    cy.factory({
      method: 'create',
      type: 'user',
      args: {
        email: 'john@doe.com',
        password: 'password'
      }
    }).as('user');
  });

  it('with wrong credentials shows error messages', function() {
    cy.visit('/login');
    cy.get('[data-testid=email]').type('wrong@doe.com');
    cy.get('[data-testid=password]').type('testpassword');
    cy.get('[data-testid=submit]').click();

    cy.get('[data-testid="alerts"]').should(
      'contain',
      'Please check your credentials and try again.'
    );
  });

  it('with correct credentials is successful', function() {
    cy.visit('/login');
    cy.get('[data-testid=email]').type(this.user.email);
    cy.get('[data-testid=password]').type('password');
    cy.get('[data-testid=submit]').click();

    cy.url().should('include', '/start');
  });
});

describe('signing up', function() {
  beforeEach(function() {
    cy.task('deleteUser', 'john@doe.com');
  });

  it('with invalid fields shows error messages', function() {
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

  it('with taken email shows error', function() {
    cy.factory({
      method: 'create',
      type: 'user',
      args: {
        email: 'john@doe.com',
        password: 'password'
      }
    }).then(user => {
      cy.visit('/signup');
      cy.get('[data-testid=email]').type(user.email);
      cy.get('[data-testid=name]').type('John Doe');
      cy.get('[data-testid=password]').type('testpassword');
      cy.get('[data-testid=submit]').click();

      cy.get('[data-testid="alerts"]').should('contain', 'Email is already taken');
    });
  });

  it('with valid fields is successful', function() {
    cy.visit('/signup');
    cy.get('[data-testid=name]').type('John Doe');
    cy.get('[data-testid=email]').type('john@doe.com');
    cy.get('[data-testid=password]').type('testpassword');
    cy.get('[data-testid=submit]').click();
    cy.url().should('include', '/start');
  });
});
