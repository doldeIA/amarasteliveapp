
import React from 'react';

const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.11 2.11a.75.75 0 01-1.06 0l-2.11-2.11a.39.39 0 00-.297-.15c-1.18-.134-2.336-.34-3.476-.383C6.218 16.279 4.848 14.547 4.848 12.6v-6.02c0-1.946 1.37-3.678 3.348-3.97z"
      clipRule="evenodd"
    />
  </svg>
);

export default ChatIcon;
