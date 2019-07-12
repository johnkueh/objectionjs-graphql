import React, { useReducer } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import PageLoading from '../components/page-loading';
import { withAuth } from '../lib/with-auth';
import { Create, Edit } from '../components/crud';
import { actions, reducer, initialState } from '../components/crud/reducer';

const Workspace = ({ router: { query } }) => {
  const [{ showCreate, showEdit, id }, dispatch] = useReducer(reducer, initialState);
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
                dispatch({ type: actions.SHOW_EDIT, id });
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
            dispatch({ type: actions.SHOW_CREATE });
          }}
        >
          Add new
        </a>
      </div>
      {showCreate && (
        <Create
          modelName="workspace"
          collectionQuery={WORKSPACES}
          createMutation={CREATE_WORKSPACE}
          dispatch={dispatch}
          fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
        />
      )}
      {showEdit && (
        <Edit
          modelName="workspace"
          id={id}
          resourceQuery={WORKSPACE}
          collectionQuery={WORKSPACES}
          updateMutation={UPDATE_WORKSPACE}
          deleteMutation={DELETE_WORKSPACE}
          dispatch={dispatch}
          fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
        />
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
