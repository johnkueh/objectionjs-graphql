import React from 'react';
import Link from 'next/link';

const Index = () => {
  return (
    <div>
      <h1>ObjectionJS GraphQL Starter</h1>
      <div>
        <Link>
          <a href="/signup">Sign up</a>
        </Link>
      </div>
      <div>
        <Link>
          <a href="/login">Login</a>
        </Link>
      </div>
    </div>
  );
};

export default Index;
