import get from 'lodash/get';
import React, { useState, useReducer, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import PageLoading from '../components/page-loading';
import { withAuth } from '../lib/with-auth';
import { useError } from '../hooks/use-error';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Workspace = ({ router: { query } }) => {
  const [{ showCreate, showEdit, id }, dispatch] = useReducer(routeReducer, routeInitialState);
  const {
    loading,
    data: { workspaces }
  } = useQuery(WORKSPACES);

  if (loading) return <PageLoading />;

  return (
    <>
      <h1>Workspaces</h1>
      <div>
        {workspaces.map(({ id, name }) => (
          <div key={id}>
            <a
              onClick={e => {
                e.preventDefault();
                dispatch({ type: SHOW_EDIT, id });
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
          href="/workspaces/new"
          onClick={e => {
            e.preventDefault();
            dispatch({ type: SHOW_CREATE });
          }}
        >
          Add new
        </a>
      </div>
      {showCreate && <Create dispatch={dispatch} />}
      {showEdit && <Edit dispatch={dispatch} id={id} />}
    </>
  );
};

const Create = ({ dispatch }) => {
  const createWorkspace = useMutation(CREATE_WORKSPACE);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessages, setError, initialState] = useError();

  return (
    <>
      <AlertMessages messages={{ warning: errorMessages }} />
      <form
        onSubmit={async e => {
          e.preventDefault();
          setError(initialState);
          setSubmitting(true);
          try {
            await createWorkspace({
              variables: {
                input: {
                  name
                }
              },
              refetchQueries: [{ query: WORKSPACES }]
            });
            setSubmitting(false);
            dispatch({ type: HIDE_CREATE });
          } catch (error) {
            setError(error);
            setSubmitting(false);
          }
        }}
      >
        <label>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          name="name"
          type="name"
          placeholder="Name"
        />
        <Button loading={submitting} loadingText="Submitting..." type="submit">
          Save
        </Button>
      </form>
      <button
        onClick={e => {
          e.preventDefault();
          dispatch({ type: HIDE_CREATE });
        }}
        type="button"
      >
        Cancel
      </button>
    </>
  );
};

const Edit = ({ id, dispatch }) => {
  const {
    loading,
    data: { workspace }
  } = useQuery(WORKSPACE, { variables: { input: { id } } });
  const [name, setName] = useState(get(workspace, 'name', ''));
  const [submitting, setSubmitting] = useState(false);
  const [errorMessages, setError, initialState] = useError();
  const updateWorkspace = useMutation(UPDATE_WORKSPACE);
  const deleteWorkspace = useMutation(DELETE_WORKSPACE);

  useEffect(() => {
    if (workspace) setName(workspace.name);
  }, [workspace]);

  if (!workspace) return null;

  return (
    <>
      <AlertMessages messages={{ warning: errorMessages }} />
      <form
        onSubmit={async e => {
          e.preventDefault();
          setSubmitting(true);
          setError(initialState);
          try {
            await updateWorkspace({
              variables: { input: { id, name } }
            });
            setSubmitting(false);
            dispatch({ type: HIDE_EDIT });
          } catch (error) {
            setError(error);
            setSubmitting(false);
          }
        }}
      >
        <label>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          name="name"
          type="name"
          placeholder="Name"
        />
        <Button loading={submitting} loadingText="Submitting..." type="submit">
          Save
        </Button>
      </form>
      <button
        onClick={async e => {
          e.preventDefault();
          await deleteWorkspace({
            variables: {
              input: { id }
            },
            refetchQueries: [{ query: WORKSPACES }]
          });
          dispatch({ type: HIDE_EDIT });
        }}
        type="button"
      >
        Delete
      </button>
      <button
        onClick={e => {
          e.preventDefault();
          dispatch({ type: HIDE_EDIT });
        }}
        type="button"
      >
        Cancel
      </button>
    </>
  );
};

const SHOW_CREATE = 'SHOW_CREATE';
const SHOW_EDIT = 'SHOW_EDIT';
const HIDE_CREATE = 'HIDE_CREATE';
const HIDE_EDIT = 'HIDE_EDIT';

const routeReducer = (state, action) => {
  switch (action.type) {
    case SHOW_CREATE:
      return {
        ...state,
        showCreate: true,
        showEdit: false,
        id: null
      };
    case HIDE_CREATE:
      return {
        ...state,
        showCreate: false,
        id: routeInitialState.id
      };
    case SHOW_EDIT:
      return {
        ...state,
        showEdit: true,
        showCreate: false,
        id: action.id
      };
    case HIDE_EDIT:
      return {
        ...state,
        showEdit: false,
        id: routeInitialState.id
      };
    default:
      return routeInitialState;
  }
};

const routeInitialState = {
  showCreate: false,
  showEdit: false,
  id: null
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
