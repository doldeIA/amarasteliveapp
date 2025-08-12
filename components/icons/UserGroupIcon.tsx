import React from 'react';

const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM4.5 16.875a3.375 3.375 0 013.375-3.375h1.5a3.375 3.375 0 013.375 3.375V18a1.5 1.5 0 01-1.5 1.5h-4.5a1.5 1.5 0 01-1.5-1.5v-1.125zM14.25 16.875a3.375 3.375 0 013.375-3.375h1.5a3.375 3.375 0 013.375 3.375V18a1.5 1.5 0 01-1.5 1.5h-4.5a1.5 1.5 0 01-1.5-1.5v-1.125z" />
  </svg>
);

export default UserGroupIcon;
