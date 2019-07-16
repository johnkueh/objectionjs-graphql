import '../support/transactional-tests';
import '../factories';

import factory from 'factory-girl';
import request from '../support/request';
import handler, { path } from '../../src/index';

describe('Creating images', () => {
  let user;
  const query = `
    mutation($input: UpsertImageInput!) {
      upsertImage(input: $input) {
        id
        publicId
        caption
      }
    }
  `;

  beforeEach(async () => {
    user = await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });
  });

  it('is able to create an image with valid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query,
      variables: {
        input: {
          publicId: 'xxxpublicid',
          caption: 'A test caption',
          imageableType: 'User',
          imageableId: user.id
        }
      }
    });

    expect(res.data.upsertImage).toEqual({
      id: expect.any(String),
      publicId: 'xxxpublicid',
      caption: 'A test caption'
    });

    const userLogo = await user.$relatedQuery('logo');
    expect(userLogo.publicId).toEqual('xxxpublicid');
    expect(userLogo.caption).toEqual('A test caption');
  });
});
