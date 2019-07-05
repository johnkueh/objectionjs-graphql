import React from 'react';
import Link from 'next/link';
import { withAuth } from '../lib/with-auth';

const Start = ({ user }) => {
  return (
    <>
      <h1>Welcome!</h1>
      <p>
        Logged in as:
        {user.email}
      </p>
    </>
  );
};

export default withAuth(Start);
