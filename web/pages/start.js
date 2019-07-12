import React from 'react';
import Router from 'next/router';
import { withAuth } from '../lib/with-auth';
import Nav from '../components/nav';

const Start = ({ user, apolloClient, logout }) => {
  return (
    <div className="bg-gray-200 w-screen h-screen">
      <div className="container mx-auto">
        <Nav />
        <h1 className="font-medium text-3xl">Dashboard</h1>
        <div className="mt-8">
          <p>
            Logged in as:
            {user.email}
          </p>
          <button
            className="text-gray-500 hover:text-gray-700"
            type="button"
            onClick={async () => {
              await logout(apolloClient);
              Router.replace('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Start);
