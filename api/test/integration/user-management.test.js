import '../support/transactional-tests';
import '../factories';
import cloudinary from 'cloudinary';
import factory from 'factory-girl';
import { query } from '../support/apollo-test-helper';
import User from '../../models/user';

describe('Fetching user profile', () => {
  let user;
  const ME = `
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
    const res = await query({
      query: ME
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is not able to fetch user profile with wrong credentials', async () => {
    const res = await query({
      query: ME
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is able to fetch user profile with credentials', async () => {
    const res = await query({
      context: { user },
      query: ME
    });

    expect(res).toMatchSnapshot({
      data: {
        me: {
          id: expect.any(String),
          name: user.name,
          email: user.email,
          logo: null
        }
      }
    });
  });

  it('is able to fetch user profile with logo', async () => {
    await factory.create('image', {
      publicId: 'user-logo-id',
      imageableType: 'UserLogo',
      imageableId: user.id
    });

    const res = await query({
      context: { user },
      query: ME
    });

    expect(res).toMatchSnapshot({
      data: {
        me: {
          id: expect.any(String),
          name: user.name,
          email: user.email,
          logo: {
            id: expect.any(String),
            publicId: 'user-logo-id'
          }
        }
      }
    });
  });
});

describe('Updating user profile', () => {
  let user;
  const UPDATE_USER = `
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
    const res = await query({
      context: { user },
      query: UPDATE_USER,
      variables: {
        input: {
          email: 'darth@vader.com',
          name: 'Darth Vader'
        }
      }
    });

    expect(res).toMatchSnapshot({
      data: {
        updateUser: {
          id: expect.any(String),
          name: 'Darth Vader',
          email: 'darth@vader.com'
        }
      }
    });
  });

  it('can update user password', async () => {
    await query({
      context: { user },
      query: UPDATE_USER,
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
    const res = await query({
      context: { user },
      query: UPDATE_USER,
      variables: {
        input: {
          name: '',
          email: 'hel@per',
          password: 'abc'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  describe('Managing user logo', () => {
    const DELETE_IMAGE = `
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

      const res = await query({
        context: { user },
        query: DELETE_IMAGE,
        variables: {
          input: {
            id: image.id
          }
        }
      });

      expect(res.errors[0].extensions).toMatchSnapshot();
      expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
    });

    it('is able to delete logo owned by user', async () => {
      const image = await factory.create('image', {
        publicId: 'existing-public-id',
        imageableType: 'UserLogo',
        imageableId: user.id
      });

      const res = await query({
        context: { user },
        query: DELETE_IMAGE,
        variables: {
          input: {
            id: image.id
          }
        }
      });

      expect(res).toMatchSnapshot({
        data: {
          deleteImage: {
            count: 1
          }
        }
      });

      const userLogo = await user.$relatedQuery('logo');
      expect(userLogo).toBeUndefined();

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(image.publicId);
    });
  });
});
