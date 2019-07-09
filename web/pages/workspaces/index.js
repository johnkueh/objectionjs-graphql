import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import PageLoading from '../../components/page-loading';
import NavLink from '../../components/nav-link';
import { withAuth } from '../../lib/with-auth';

const Workspaces = () => {
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
            <NavLink href={`/workspaces/show?id=${id}`} as={`/workspaces/${id}`}>
              {name}
            </NavLink>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <NavLink href="/workspaces/new">Add new</NavLink>
      </div>
    </>
  );
};

export default withAuth(Workspaces);

export const WORKSPACES = gql`
  query {
    workspaces {
      id
      name
    }
  }
`;
