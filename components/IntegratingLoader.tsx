import React from 'react';

const IntegratingLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/90 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      <div className="text-center">
        <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Integrando
        </h1>
        <div className="text-white text-4xl font-bold leading-none tracking-widest">
          <span className="integrating-dot-1">.</span>
          <span className="integrating-dot-2">.</span>
          <span className="integrating-dot-3">.</span>
        </div>
      </div>
    </div>
  );
};

export default IntegratingLoader;