import factory from 'factory-girl';
import '../support/transactional-tests';
import '../factories';
import { query } from '../support/apollo-test-helper';

describe('Logging in', () => {
  const LOGIN = `
    mutation($input: LoginInput!) {
      login(input: $input) {
        jwt
        user {
          id
          name
          email
        }
      }
    }
  `;
  beforeEach(async () => {
    await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });
  });

  it('is not able to login with wrong credentials', async () => {
    const res = await query({
      query: LOGIN,
      variables: {
        input: {
          email: 'john@doe.com',
          password: 'wrongpassword'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is able to login with correct credentials', async () => {
    const res = await query({
      query: LOGIN,
      variables: {
        input: {
          email: 'john@doe.com',
          password: 'password'
        }
      }
    });

    expect(res).toMatchSnapshot({
      data: {
        login: {
          jwt: expect.any(String),
          user: {
            id: expect.any(String)
          }
        }
      }
    });
  });
});

describe('Signing up', () => {
  const SIGNUP = `
    mutation($input: SignupInput!) {
      signup(input: $input) {
        jwt
        user {
          id
          name
          email
        }
      }
    }
  `;
  it('is able to signup successfully', async () => {
    const res = await query({
      query: SIGNUP,
      variables: {
        input: {
          name: 'John Doe',
          email: 'john@doe.com',
          password: 'wrongpassword'
        }
      }
    });

    expect(res).toMatchSnapshot({
      data: {
        signup: {
          jwt: expect.any(String),
          user: {
            id: expect.any(String),
            email: 'john@doe.com',
            name: 'John Doe'
          }
        }
      }
    });
  });

  it('is not able to signup with missing fields', async () => {
    const res = await query({
      query: SIGNUP,
      variables: {
        input: {
          name: '',
          email: 'hello@tes',
          password: 'short'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is not able to signup with taken email', async () => {
    await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });

    const res = await query({
      query: SIGNUP,
      variables: {
        input: {
          name: 'John Doe',
          email: 'john@doe.com',
          password: 'password'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });
});
