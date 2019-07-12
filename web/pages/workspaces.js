import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Router from 'next/router';
import { withAuth } from '../lib/with-auth';
import { useList } from '../hooks/use-list';
import { useCrud } from '../hooks/use-crud';

const Workspace = ({ router: { query, push } }) => {
  const {
    Create,
    Edit,
    isCreating,
    isEditing,
    showCreate,
    hideCreate,
    showEdit,
    hideEdit
  } = useCrud({
    modelName: 'workspace',
    resourceQuery: WORKSPACE,
    collectionQuery: WORKSPACES,
    createMutation: CREATE_WORKSPACE,
    updateMutation: UPDATE_WORKSPACE,
    deleteMutation: DELETE_WORKSPACE
  });

  const { List } = useList({
    modelName: 'workspace',
    collectionQuery: WORKSPACES
  });

  useEffect(() => {
    if (query.new) {
      showCreate();
    } else if (query.edit) {
      showEdit(query.id);
    }
  }, []);

  return (
    <>
      <h1>Workspaces</h1>
      <List
        onSelect={id => {
          Router.push(`/workspaces?edit=true&id=${id}`, `/workspaces/${id}/edit`);
          showEdit(id);
        }}
      />
      <hr />
      <div>
        <a
          data-testid="workspace-new-button"
          href="/workspaces/new"
          onClick={e => {
            e.preventDefault();
            Router.push('/workspaces?new=true', '/workspaces/new');
            showCreate();
          }}
        >
          Add new
        </a>
      </div>
      {isCreating && (
        <Create
          fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
          onSuccess={() => {
            Router.push('/workspaces');
            hideCreate();
          }}
          onCancel={() => {
            Router.push('/workspaces');
            hideCreate();
          }}
        />
      )}
      {isEditing && (
        <Edit
          fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
          onSuccess={() => {
            Router.push('/workspaces');
            hideCreate();
          }}
          onCancel={() => {
            Router.push('/workspaces');
            hideEdit();
          }}
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

Workspace.propTypes = {
  router: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
  ).isRequired
};

export default withAuth(Workspace);
