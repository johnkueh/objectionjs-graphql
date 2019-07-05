import '../support/transactional-tests';
import '../factories';

import factory from 'factory-girl';
import request from '../support/request';
import handler, { path } from '../../src/index';

describe('Fetching user profile', () => {
  let user;
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
      query: `
        query {
          me {
            id
            name
            email
          }
        }
      `
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
      query: `
        query {
          me {
            id
            name
            email
          }
        }
      `
    });

    expect(res.data.me).toEqual({
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});

describe('Updating user profile successfully', () => {
  it('can update user profile with valid fields', () => {});
});

describe('Failed to update user profile', () => {});
