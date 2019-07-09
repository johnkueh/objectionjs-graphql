import React from 'react';
import Router from 'next/router';
import { withAuth } from '../lib/with-auth';
import NavLink from '../components/nav-link';

const Start = ({ user, apolloClient, logout }) => {
  return (
    <>
      <h1>Welcome!</h1>
      <p>
        Logged in as:
        {user.email}
      </p>
      <div>
        <NavLink href="/profile">Profile</NavLink>
        <NavLink href="/workspaces">Workspaces</NavLink>
      </div>
      <button
        type="button"
        onClick={async () => {
          await logout(apolloClient);
          Router.replace('/login');
        }}
      >
        Logout
      </button>
    </>
  );
};

export default withAuth(Start);
