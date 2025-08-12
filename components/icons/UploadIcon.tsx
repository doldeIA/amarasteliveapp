import React from 'react';

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V3m0 0l-3.75 3.75M12 3l3.75 3.75M17.25 12v6.75A2.25 2.25 0 0115 21H9a2.25 2.25 0 01-2.25-2.25V12"
    />
  </svg>
);

export default UploadIcon;
