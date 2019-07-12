import React from 'react';
import NavLink from './nav-link';

const Nav = () => (
  <div className="pt-4 w-full flex justify-end">
    <NavLink className="block p-3 font-medium text-gray-600 hover:text-gray-800" href="/start">
      Dashboard
    </NavLink>
    <NavLink className="block p-3 font-medium text-gray-600 hover:text-gray-800" href="/workspaces">
      Workspaces
    </NavLink>
    <NavLink className="block p-3 font-medium text-gray-600 hover:text-gray-800" href="/profile">
      Profile
    </NavLink>
  </div>
);

export default Nav;
