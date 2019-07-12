import React, { useReducer } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import PageLoading from '../components/page-loading';
import { withAuth } from '../lib/with-auth';
import { useForm } from '../hooks/use-form';
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
      <div data-testid="workspaces">
        {workspaces.map(({ id, name }) => (
          <div key={id}>
            <a
              data-testid="workspace-link"
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
          data-testid="workspace-new-button"
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
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: {
      name: ''
    },
    onSubmit: async ({ currentValues, setSubmitting }) => {
      await createWorkspace({
        variables: {
          input: currentValues
        },
        refetchQueries: [{ query: WORKSPACES }]
      });
      dispatch({ type: HIDE_CREATE });
    }
  });

  return (
    <>
      <AlertMessages messages={{ warning: errors }} />
      <form data-testid="workspace-create-form" {...formProps()}>
        <label>Name</label>
        <input {...fieldProps('name')} type="text" placeholder="Name" />
        <Button
          data-testid="workspace-form-submit"
          loading={submitting}
          loadingText="Submitting..."
          type="submit"
        >
          Save
        </Button>
      </form>
      <button
        data-testid="cancel"
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

  if (!workspace) return null;

  return <EditForm key={workspace.id} workspace={workspace} dispatch={dispatch} />;
};

const EditForm = ({ workspace, dispatch }) => {
  const updateWorkspace = useMutation(UPDATE_WORKSPACE);
  const deleteWorkspace = useMutation(DELETE_WORKSPACE);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: { name: workspace.name },
    onSubmit: async ({ currentValues: { name }, setSubmitting }) => {
      await updateWorkspace({
        variables: { input: { id: workspace.id, name } }
      });
      setSubmitting(false);
      dispatch({ type: HIDE_EDIT });
    }
  });

  return (
    <>
      <AlertMessages messages={{ warning: errors }} />
      <form {...formProps()}>
        <label>Name</label>
        <input {...fieldProps('name')} type="text" placeholder="Name" />
        <Button
          data-testid="workspace-form-submit"
          loading={submitting}
          loadingText="Submitting..."
          type="submit"
        >
          Save
        </Button>
      </form>
      <button
        data-testid="workspace-delete"
        onClick={async e => {
          e.preventDefault();
          await deleteWorkspace({
            variables: {
              input: { id: workspace.id }
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
        data-testid="cancel"
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
