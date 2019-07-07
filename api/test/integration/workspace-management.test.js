import '../support/transactional-tests';
import '../factories';

import factory from 'factory-girl';
import request from '../support/request';
import handler, { path } from '../../src/index';

describe('Fetching workspaces', () => {
  let user;
  const query = `
    query {
      workspaces {
        id
        name
      }
    }
  `;

  beforeEach(async () => {
    user = await factory.create('userWithWorkspace', {
      email: 'john@doe.com',
      password: 'password'
    });
  });

  it("is able to fetch list of user's workspaces", async () => {
    await factory.create('workspace', {
      name: 'Alt workspace'
    });
    const userWorkspaces = await user.$relatedQuery('workspaces');

    const res = await request({
      handler,
      apiPath: path,
      query,
      cookies: [`jwt=${user.jwt}`]
    });

    expect(res.data.workspaces.map(({ id }) => id)).toEqual(userWorkspaces.map(({ id }) => id));
  });

  it("is not able to fetch list of user's workspaces without login", async () => {
    const res = await request({
      handler,
      apiPath: path,
      query
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });
});

describe('Fetching a workspace', () => {
  it('is able to fetch a user workspace', async () => {});

  it('is able to fetch a user workspace without login', async () => {});

  it("is not able to fetch other user's workspace", async () => {});
});

describe('Creating workspaces', () => {
  let user;
  const query = `
    mutation($input: CreateWorkspaceInput!) {
      createWorkspace(input: $input) {
        id
        name
      }
    }
  `;

  beforeEach(async () => {
    user = await factory.create('user', {
      email: 'john@doe.com',
      password: 'password'
    });
  });

  it('is able to create a workspace with valid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query,
      variables: {
        input: {
          name: 'New workspace'
        }
      }
    });

    const userWorkspaces = await user.$relatedQuery('workspaces');

    expect(res.data.createWorkspace).toEqual({
      id: expect.any(String),
      name: 'New workspace'
    });

    expect(userWorkspaces[0]).toEqual({
      id: expect.any(String),
      name: 'New workspace'
    });
  });

  it('is not able to create a workspace with invalid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query,
      variables: {
        input: {
          name: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      name: 'Name must be at least 1 characters'
    });
  });

  it('is not able to create workspace without login', async () => {
    const res = await request({
      handler,
      apiPath: path,
      query,
      variables: {
        input: {
          name: 'Workspace name'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });
});

describe('Updating and deleting workspaces', () => {
  let user;
  const UPDATE_WORKSPACE = `
    mutation($input: UpdateWorkspaceInput!) {
      updateWorkspace(input: $input) {
        id
        name
      }
    }
  `;

  const DELETE_WORKSPACE = `
    mutation($input: DeleteWorkspaceInput!) {
      deleteWorkspace(input: $input) {
        count
      }
    }
  `;

  beforeEach(async () => {
    user = await factory.create('userWithWorkspace', {
      email: 'john@doe.com',
      password: 'password'
    });
    user.workspaces = await user.$relatedQuery('workspaces');
  });

  it('is able to update workspace with valid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id,
          name: 'Updated name'
        }
      }
    });

    expect(res.data.updateWorkspace).toEqual({
      id: expect.any(String),
      name: 'Updated name'
    });
  });

  it('is not able to update workspace with invalid fields', async () => {
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id,
          name: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      name: 'Name must be at least 1 characters'
    });
  });

  it('is not able to update workspace without login', async () => {
    const res = await request({
      handler,
      apiPath: path,
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id,
          name: 'Updated name'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });

  it("is not able to update others' workspace", async () => {
    const other = await factory.create('workspace', { name: 'Other' });
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: other.id,
          name: 'Failed name'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });

  it('is able to delete own workspace', async () => {
    const workspaceId = user.workspaces[0].id;

    let userWorkspaces = await user.$relatedQuery('workspaces');
    expect(userWorkspaces.map(({ id }) => id)).toContain(workspaceId);

    await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query: DELETE_WORKSPACE,
      variables: {
        input: {
          id: workspaceId
        }
      }
    });

    userWorkspaces = await user.$relatedQuery('workspaces');
    expect(userWorkspaces.map(({ id }) => id)).not.toContain(workspaceId);
  });

  it("is not able to delete others' workspace", async () => {
    const other = await factory.create('workspace', { name: 'Other' });
    const res = await request({
      handler,
      apiPath: path,
      cookies: [`jwt=${user.jwt}`],
      query: DELETE_WORKSPACE,
      variables: {
        input: {
          id: other.id
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      auth: 'You are not authorized to perform this action'
    });
  });
});
