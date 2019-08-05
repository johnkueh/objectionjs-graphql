import '../support/transactional-tests';
import '../factories';
import cloudinary from 'cloudinary';
import factory from 'factory-girl';
import { query } from '../support/apollo-test-helper';

describe('Upserting images', () => {
  let user;
  const UPSERT_IMAGE = `
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

  it('is not able to upsert image without auth', async () => {
    const res = await query({
      query: UPSERT_IMAGE,
      variables: {
        input: {
          publicId: 'public-id',
          caption: 'A test caption'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });

  it('is not able to create an image with missing fields', async () => {
    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          caption: 'A test caption'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      publicId: 'PublicId is a required field',
      imageableType: 'ImageableType is a required field',
      imageableId: 'ImageableId is a required field'
    });
  });

  it('is not able to create an image with invalid fields', async () => {
    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          publicId: 'xxx-id',
          imageableId: 'yyy-id',
          imageableType: 'WeirdImage',
          caption: 'A test caption'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors.imageableType).toContain(
      'ImageableType must match the following'
    );
  });

  it('is not able to create an image with existing publicId', async () => {
    await factory.create('image', {
      publicId: 'existing-public-id',
      imageableType: 'UserLogo',
      imageableId: user.id
    });

    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          publicId: 'existing-public-id',
          imageableId: 'yyy-id',
          imageableType: 'UserLogo'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      publicId: 'PublicId is already taken'
    });
  });

  it('is not able to create an image with existing imageableId', async () => {
    await factory.create('image', {
      publicId: 'existing-public-id',
      imageableType: 'UserLogo',
      imageableId: user.id
    });

    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          publicId: 'new-public-id',
          imageableId: user.id,
          imageableType: 'UserLogo'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      imageableId: 'ImageableId with scope imageableType is already taken'
    });
  });

  it('is able to create an image with existing imageableId but different scope', async () => {
    await factory.create('image', {
      publicId: 'existing-public-id',
      imageableType: 'UserLogo',
      imageableId: user.id
    });

    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          publicId: 'xxxpublicid',
          imageableId: user.id,
          imageableType: 'UserProfilePhoto'
        }
      }
    });

    expect(res.data.upsertImage).toEqual({
      id: expect.any(String),
      publicId: 'xxxpublicid',
      caption: null
    });
  });

  it('is able to create an image with valid fields', async () => {
    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          publicId: 'xxxpublicid',
          caption: 'A test caption',
          imageableType: 'UserLogo',
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

  it('is able to update an existing image with valid fields, does not create a new image', async () => {
    const image = await factory.create('image', {
      publicId: 'existing-public-id',
      imageableType: 'UserLogo',
      imageableId: user.id
    });

    const res = await query({
      context: { user },
      query: UPSERT_IMAGE,
      variables: {
        input: {
          id: image.id,
          publicId: 'new-public-id',
          imageableType: 'UserLogo',
          imageableId: user.id
        }
      }
    });

    expect(res.data.upsertImage).toEqual({
      id: image.id,
      caption: null,
      publicId: 'new-public-id'
    });

    const userLogo = await user.$relatedQuery('logo');
    expect(userLogo.id).toEqual(image.id);
    expect(userLogo.publicId).toEqual('new-public-id');
  });
});

describe('Deleting images', () => {
  const DELETE_IMAGE = `
    mutation($input: DeleteImageInput!) {
      deleteImage(input: $input) {
        count
      }
    }
  `;

  beforeEach(async () => {
    await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });
  });

  it('is not able to delete image without auth', async () => {
    const res = await query({
      query: DELETE_IMAGE,
      variables: {
        input: {
          id: 'xxx-image-id'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });

    expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
  });
});
