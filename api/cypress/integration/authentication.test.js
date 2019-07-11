describe('logging in', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'john@doe.com');
    cy.factoryCreate({
      user: {
        email: 'john@doe.com',
        password: 'password'
      }
    }).as('user');
  });

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

  it('with correct credentials is successful', () => {
    cy.get('@user').then(user => {
      cy.visit('/login');
      cy.get('[data-testid=email]').type(user.email);
      cy.get('[data-testid=password]').type('password');
      cy.get('[data-testid=submit]').click();

      cy.url().should('include', '/start');
    });
  });
});

describe('signing up', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'john@doe.com');
  });

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

  it('with taken email shows error', () => {
    cy.factoryCreate({
      user: {
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

  it('with valid fields is successful', () => {
    cy.visit('/signup');
    cy.get('[data-testid=name]').type('John Doe');
    cy.get('[data-testid=email]').type('john@doe.com');
    cy.get('[data-testid=password]').type('testpassword');
    cy.get('[data-testid=submit]').click();
    cy.url().should('include', '/start');
  });
});
