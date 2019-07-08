import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import Router, { withRouter } from 'next/router';
import Link from 'next/link';
import { WORKSPACES } from './index';
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
        <Link href={`/workspaces/edit?id=${id}`} as={`/workspaces/${id}/edit`}>
          <a href={`/workspaces/${id}/edit`}>Edit</a>
        </Link>
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
        <Link href="/workspaces">
          <a href="/workspaces">Workspaces</a>
        </Link>
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
