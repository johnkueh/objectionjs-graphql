import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAuth } from '../lib/with-auth';

const Start = ({ user, apolloClient, logout }) => {
  return (
    <>
      <h1>Welcome!</h1>
      <p>
        Logged in as:
        {user.email}
      </p>
      <div>
        <Link href="/profile">
          <a href="/profile">Profile</a>
        </Link>
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
