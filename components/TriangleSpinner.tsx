import React from 'react';

const TriangleSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="w-16 h-16 animate-spin" style={{ animationDuration: '4.4s', animationTimingFunction: 'linear' }}>
        {/* Equilateral triangle using SVG for perfect symmetry */}
        <svg viewBox="0 0 100 86.6">
            <polygon points="50,0 100,86.6 0,86.6" fill="rgba(255, 255, 255, 0.9)" />
        </svg>
      </div>
    </div>
  );
};

export default TriangleSpinner;