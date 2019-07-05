import '../support/transactional-tests';
import '../factories';

import factory from 'factory-girl';
import request from '../support/request';
import handler, { path } from '../../src/index';

describe('Logging in', () => {
  const query = `
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
    const res = await request({
      handler,
      apiPath: path,
      query,
      variables: {
        input: {
          email: 'john@doe.com',
          password: 'wrongpassword'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'Please check your credentials and try again.'
    });
  });

  it('is able to login with correct credentials', async () => {
    const res = await request({
      handler,
      apiPath: path,
      query,
      variables: {
        input: {
          email: 'john@doe.com',
          password: 'password'
        }
      }
    });

    expect(res.data.login).toEqual({
      jwt: expect.any(String),
      user: {
        id: expect.any(String),
        email: 'john@doe.com',
        name: 'John Doe'
      }
    });
  });
});

describe('Signing up', () => {
  const query = `
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
    const res = await request({
      handler,
      apiPath: path,
      query,
      variables: {
        input: {
          name: 'John Doe',
          email: 'john@doe.com',
          password: 'wrongpassword'
        }
      }
    });

    expect(res.data.signup).toEqual({
      jwt: expect.any(String),
      user: {
        id: expect.any(String),
        email: 'john@doe.com',
        name: 'John Doe'
      }
    });
  });

  it('is not able to signup with missing fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      query,
      variables: {
        input: {
          name: '',
          email: 'hello@tes',
          password: 'short'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      name: 'Name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });

  it('is not able to signup with taken email', async () => {
    await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });

    const res = await request({
      handler,
      apiPath: path,
      query,
      variables: {
        input: {
          name: 'John Doe',
          email: 'john@doe.com',
          password: 'password'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      email: 'Email is already taken'
    });
  });
});
