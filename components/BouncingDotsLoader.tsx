import React from 'react';

const BouncingDotsLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex gap-2">
        <span className="w-2.5 h-2.5 bg-black rounded-full animate-bounce [animation-delay:0ms]"></span>
        <span className="w-2.5 h-2.5 bg-black rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-2.5 h-2.5 bg-black rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>
    </div>
  );
};

export default BouncingDotsLoader;