import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Router from 'next/router';
import { withAuth } from '../lib/with-auth';
import Nav from '../components/nav';
import Modal from '../components/modal';
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

  const goToList = () => {
    Router.push('/workspaces', '/workspaces', {
      shallow: true
    });
    hideEdit();
    hideCreate();
  };

  return (
    <div className="bg-gray-200 w-screen h-screen">
      <div className="container mx-auto">
        <Nav />
        <h1 className="font-medium text-3xl">Workspaces</h1>
        <div className="my-5">
          <List
            onSelect={id => {
              Router.push(`/workspaces?edit=true&id=${id}`, `/workspaces/${id}/edit`, {
                shallow: true
              });
              showEdit(id);
            }}
          />
        </div>
        <hr />
        {isCreating && (
          <Modal onHide={goToList}>
            <Create
              fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
              onSuccess={goToList}
              onCancel={goToList}
            />
          </Modal>
        )}
        {isEditing && (
          <Modal onHide={goToList}>
            <Edit
              fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
              onSuccess={goToList}
              onCancel={goToList}
            />
          </Modal>
        )}
        {!isCreating && !isEditing && (
          <div className="mt-8">
            <a
              className="bg-blue-500 hover:bg-blue-700 py-2 px-3 rounded text-white font-medium focus:outline-none focus:shadow-outline"
              data-testid="workspace-new-button"
              href="/workspaces/new"
              onClick={e => {
                e.preventDefault();
                Router.push('/workspaces?new=true', '/workspaces/new', {
                  shallow: true
                });
                showCreate();
              }}
            >
              Add new
            </a>
          </div>
        )}
      </div>
    </div>
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
