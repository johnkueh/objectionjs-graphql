import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import Router, { withRouter } from 'next/router';
import { WORKSPACES } from './index';
import NavLink from '../../components/nav-link';
import PageLoading from '../../components/page-loading';
import { withAuth } from '../../lib/with-auth';

const Show = ({
  router: {
    query: { id }
  }
}) => {
  const deleteWorkspace = useMutation(DELETE_WORKSPACE);
  const {
    loading,
    data: { workspace }
  } = useQuery(WORKSPACE, { variables: { input: { id } } });

  if (loading) return <PageLoading />;

  return (
    <>
      <h1>Workspace</h1>
      <p>{workspace.name}</p>
      <div>
        <NavLink href={`/workspaces/edit?id=${id}`} as={`/workspaces/${id}/edit`}>
          Edit
        </NavLink>
        <button
          onClick={async () => {
            if (window.confirm('Delete this workspace?')) {
              await deleteWorkspace({
                variables: {
                  input: { id }
                },
                refetchQueries: [{ query: WORKSPACES }]
              });
              Router.push('/workspaces');
            }
          }}
          type="button"
        >
          Delete
        </button>
      </div>
      <hr />
      <div>
        <NavLink href="/workspaces">Workspaces</NavLink>
      </div>
    </>
  );
};

export default withAuth(withRouter(Show));

export const WORKSPACE = gql`
  query($input: WorkspaceInput!) {
    workspace(input: $input) {
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
