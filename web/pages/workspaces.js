import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import PageLoading from '../components/page-loading';
import { withAuth } from '../lib/with-auth';
import { useCrud } from '../hooks/use-crud';

const Workspace = ({ router: { query } }) => {
  const { Create, Edit, isCreating, isEditing, showCreate, showEdit } = useCrud({
    modelName: 'workspace',
    resourceQuery: WORKSPACE,
    collectionQuery: WORKSPACES,
    createMutation: CREATE_WORKSPACE,
    updateMutation: UPDATE_WORKSPACE,
    deleteMutation: DELETE_WORKSPACE
  });

  const {
    loading,
    data: { workspaces }
  } = useQuery(WORKSPACES);

  if (loading) return <PageLoading />;

  return (
    <>
      <h1>Workspaces</h1>
      <div data-testid="workspaces">
        {workspaces.map(({ id, name }) => (
          <div key={id}>
            <a
              data-testid="workspace-link"
              onClick={e => {
                e.preventDefault();
                showEdit(id);
              }}
              href={`/workspaces/${id}/edit`}
            >
              {name}
            </a>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <a
          data-testid="workspace-new-button"
          href="/workspaces/new"
          onClick={e => {
            e.preventDefault();
            showCreate();
          }}
        >
          Add new
        </a>
      </div>
      {isCreating && (
        <Create fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]} />
      )}
      {isEditing && (
        <Edit fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]} />
      )}
    </>
  );
};

const WORKSPACES = gql`
  query {
    workspaces {
      id
      name
    }
  }
`;

const WORKSPACE = gql`
  query($input: WorkspaceInput!) {
    workspace(input: $input) {
      id
      name
    }
  }
`;

const CREATE_WORKSPACE = gql`
  mutation($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_WORKSPACE = gql`
  mutation($input: UpdateWorkspaceInput!) {
    updateWorkspace(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_WORKSPACE = gql`
  mutation($input: DeleteWorkspaceInput!) {
    deleteWorkspace(input: $input) {
      count
    }
  }
`;

export default withAuth(Workspace);
