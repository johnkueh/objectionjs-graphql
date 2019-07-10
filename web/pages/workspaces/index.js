import React, { useReducer } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import PageLoading from '../../components/page-loading';
import NavLink from '../../components/nav-link';
import { withAuth } from '../../lib/with-auth';

const Workspaces = ({ router: { query } }) => {
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
                dispatch({ type: 'showEdit', id });
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
            dispatch({ type: 'showCreate' });
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
  return (
    <>
      <div>Show Create</div>
      <label>Name</label>
      <input type="text" />
      <button type="submit">Create</button>
      <button
        onClick={e => {
          e.preventDefault();
          dispatch({ type: 'hideCreate' });
        }}
        type="button"
      >
        Cancel
      </button>
    </>
  );
};

const Edit = ({ id, dispatch }) => {
  return (
    <>
      <div>Show Edit - {id}</div>
      <label>Name</label>
      <input type="text" />
      <button type="submit">Save</button>
      <button
        onClick={e => {
          e.preventDefault();
          dispatch({ type: 'hideEdit' });
        }}
        type="button"
      >
        Cancel
      </button>
    </>
  );
};

export default withAuth(Workspaces);

const routeReducer = (state, action) => {
  switch (action.type) {
    case 'showCreate':
      return {
        ...state,
        showCreate: true,
        id: null
      };
    case 'hideCreate':
      return {
        ...state,
        showCreate: false,
        id: routeInitialState.id
      };
    case 'showEdit':
      return {
        ...state,
        showEdit: true,
        id: action.id
      };
    case 'hideEdit':
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

export const WORKSPACES = gql`
  query {
    workspaces {
      id
      name
    }
  }
`;
