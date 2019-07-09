import React from 'react';
import Link from 'next/link';

const NavLink = ({ href, as = href, className, children }) => {
  return (
    <Link href={href} as={as}>
      <a className={className} href={as}>
        {children}
      </a>
    </Link>
  );
};

export default NavLink;
