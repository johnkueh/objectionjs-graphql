import React from 'react';
import Router from 'next/router';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import PageLoading from '../components/page-loading';

const ME = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

const logout = apolloClient =>
  new Promise(res => {
    Cookies.remove('jwt');
    apolloClient.clearStore();
    res();
  });

export const withAuth = WrappedComponent => props => {
  const {
    loading,
    data: { me: user }
  } = useQuery(ME);

  if (!loading && !user) {
    if (process.browser) {
      Router.push('/login');
      return null;
    }
  }

  if (!loading) {
    return <WrappedComponent {...props} logout={logout} user={user} />;
  }

  return <PageLoading />;
};

export default {
  withAuth
};
