import '../support/transactional-tests';
import '../factories';
import cloudinary from 'cloudinary';
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
        logo {
          id
          publicId
        }
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
      email: user.email,
      logo: null
    });
  });

  it('is able to fetch user profile with logo', async () => {
    await factory.create('image', {
      publicId: 'user-logo-id',
      imageableType: 'UserLogo',
      imageableId: user.id
    });

    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query
    });

    expect(res.data.me).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      logo: {
        id: expect.any(String),
        publicId: 'user-logo-id'
      }
    });
  });
});

describe('Updating user profile', () => {
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

  it('fails to update with invalid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query,
      variables: {
        input: {
          name: '',
          email: 'hel@per',
          password: 'abc'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      name: 'Name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });

  describe('Managing user logo', () => {
    const deleteImageMutation = `
      mutation($input: DeleteImageInput!) {
        deleteImage(input: $input) {
          count
        }
      }
    `;
    it('is not able to delete logo owned by other user', async () => {
      const image = await factory.create('image', {
        publicId: 'existing-public-id',
        imageableType: 'UserLogo',
        imageableId: 'other-user-id'
      });

      const res = await request({
        handler,
        apiPath: path,
        cookies: [`jwt=${user.jwt}`],
        query: deleteImageMutation,
        variables: {
          input: {
            id: image.id
          }
        }
      });

      expect(res.errors[0].extensions.exception.errors).toEqual({
        auth: 'You are not authorized to perform this action'
      });

      expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
    });

    it('is able to delete logo owned by user', async () => {
      const image = await factory.create('image', {
        publicId: 'existing-public-id',
        imageableType: 'UserLogo',
        imageableId: user.id
      });

      const res = await request({
        handler,
        apiPath: path,
        cookies: [`jwt=${user.jwt}`],
        query: deleteImageMutation,
        variables: {
          input: {
            id: image.id
          }
        }
      });

      expect(res.data.deleteImage).toEqual({
        count: 1
      });

      const userLogo = await user.$relatedQuery('logo');
      expect(userLogo).toBeUndefined();

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(image.publicId);
    });
  });
});
