import '../support/transactional-tests';
import '../factories';

import factory from 'factory-girl';
import request from '../support/request';
import handler, { path } from '../../src/index';
import User from '../../models/user';

describe('Fetching user profile', () => {
  let user;
  const query = `
    query {
      me {
        id
        name
        email
      }
    }
  `;
  beforeEach(async () => {
    user = await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });
  });

  it('is not able to fetch user profile without credentials', async () => {
    const res = await request({
      handler,
      apiPath: path,
      query
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });

  it('is not able to fetch user profile with wrong credentials', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=wrongjwt`],
      query
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });

  it('is able to fetch user profile with credentials', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query
    });

    expect(res.data.me).toEqual({
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});

describe('Updating user profile successfully', () => {
  let user;
  const query = `
    mutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        id
        name
        email
      }
    }
  `;
  beforeEach(async () => {
    user = await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });
  });
  it('can update user profile with valid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query,
      variables: {
        input: {
          email: 'darth@vader.com',
          name: 'Darth Vader'
        }
      }
    });

    expect(res.data.updateUser).toEqual({
      id: user.id,
      name: 'Darth Vader',
      email: 'darth@vader.com'
    });
  });

  it('can update user password', async () => {
    await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query,
      variables: {
        input: {
          password: 'newpassword'
        }
      }
    });

    const updatedUser = await User.query().findById(user.id);
    expect(updatedUser.validPassword('newpassword')).toBe(true);
  });
});

describe('Failed to update user profile', () => {});
