import '../support/transactional-tests';
import '../factories';
import factory from 'factory-girl';
import { query } from '../support/apollo-test-helper';

describe('Fetching workspaces', () => {
  let user;
  const WORKSPACES = `
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

    const res = await query({
      query: WORKSPACES,
      context: { user }
    });

    expect(res).toMatchSnapshot({
      data: {
        workspaces: [
          {
            id: expect.any(String),
            name: userWorkspaces[0].name
          }
        ]
      }
    });
  });

  it("is not able to fetch list of user's workspaces without login", async () => {
    const res = await query({
      query: WORKSPACES
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });
});

describe('Fetching a workspace', () => {
  let user;
  const WORKSPACE = `
    query($input: WorkspaceInput!) {
      workspace(input: $input) {
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
    user.workspaces = await user.$relatedQuery('workspaces');
  });

  it('is able to fetch a user workspace', async () => {
    const res = await query({
      context: { user },
      query: WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id
        }
      }
    });

    expect(res).toMatchSnapshot({
      data: {
        workspace: {
          id: expect.any(String),
          name: user.workspaces[0].name
        }
      }
    });
  });

  it('is not able to fetch a user workspace without login', async () => {
    const res = await query({
      query: WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it("is not able to fetch other user's workspace", async () => {
    const workspace = await factory.create('workspace', { name: 'Other workspace ' });
    const res = await query({
      context: { user },
      query: WORKSPACE,
      variables: {
        input: {
          id: workspace.id
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });
});

describe('Creating workspaces', () => {
  let user;
  const CREATE_WORKSPACE = `
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
    const res = await query({
      context: { user },
      query: CREATE_WORKSPACE,
      variables: {
        input: {
          name: 'New workspace'
        }
      }
    });

    const userWorkspaces = await user.$relatedQuery('workspaces');

    expect(res).toMatchSnapshot({
      data: {
        createWorkspace: {
          id: expect.any(String),
          name: 'New workspace'
        }
      }
    });

    expect(userWorkspaces[0]).toMatchSnapshot({
      id: expect.any(String),
      name: 'New workspace'
    });
  });

  it('is not able to create a workspace with invalid fields', async () => {
    const res = await query({
      context: { user },
      query: CREATE_WORKSPACE,
      variables: {
        input: {
          name: ''
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is not able to create workspace without login', async () => {
    const res = await query({
      query: CREATE_WORKSPACE,
      variables: {
        input: {
          name: 'Workspace name'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
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
    const res = await query({
      context: { user },
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id,
          name: 'Updated name'
        }
      }
    });

    expect(res).toMatchSnapshot({
      data: {
        updateWorkspace: {
          id: expect.any(String),
          name: 'Updated name'
        }
      }
    });
  });

  it('is not able to update workspace with invalid fields', async () => {
    const res = await query({
      context: { user },
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id,
          name: ''
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is not able to update workspace without login', async () => {
    const res = await query({
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: user.workspaces[0].id,
          name: 'Updated name'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it("is not able to update others' workspace", async () => {
    const other = await factory.create('workspace', { name: 'Other' });
    const res = await query({
      context: { user },
      query: UPDATE_WORKSPACE,
      variables: {
        input: {
          id: other.id,
          name: 'Failed name'
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });

  it('is able to delete own workspace', async () => {
    const workspaceId = user.workspaces[0].id;

    let userWorkspaces = await user.$relatedQuery('workspaces');
    expect(userWorkspaces.map(({ id }) => id)).toContain(workspaceId);

    await query({
      context: { user },
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
    const res = await query({
      context: { user },
      query: DELETE_WORKSPACE,
      variables: {
        input: {
          id: other.id
        }
      }
    });

    expect(res.errors[0].extensions).toMatchSnapshot();
  });
});
