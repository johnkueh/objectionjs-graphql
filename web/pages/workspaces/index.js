import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import Link from 'next/link';
import PageLoading from '../../components/page-loading';
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
            <Link href={`/workspaces/show?id=${id}`} as={`/workspaces/${id}`}>
              <a href={`/workspaces/${id}`}>{name}</a>
            </Link>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <Link href="/workspaces/new">
          <a href="/workspaces/new">Add new</a>
        </Link>
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
