import React from 'react';
import NavLink from '../components/nav-link';

const Index = () => {
  return (
    <div>
      <h1>ObjectionJS GraphQL Starter</h1>
      <div>
        <NavLink href="/signup">Sign up</NavLink>
      </div>
      <div>
        <NavLink href="/login">Login</NavLink>
      </div>
    </div>
  );
};

export default Index;
