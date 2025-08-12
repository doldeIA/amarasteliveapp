import React, { useMemo } from 'react';

const SparkleOverlay: React.FC = () => {
  const sparkles = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      const size = Math.random() * 2 + 1; // 1px to 3px
      const isPink = Math.random() > 0.6; // 40% chance of being pink/fuchsia
      const color = isPink ? (Math.random() > 0.5 ? '#e400ff' : '#F8AFA6') : '#FFFFFF';

      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        color: color, // For the drop-shadow filter
        animationDuration: `${5 + Math.random() * 5}s`, // 5s to 10s duration
        animationDelay: `${Math.random() * 10}s`,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {sparkles.map(style => (
        <div
          key={style.id}
          className="sparkle-instance"
          style={{
            top: style.top,
            left: style.left,
            width: style.width,
            height: style.height,
            backgroundColor: style.backgroundColor,
            color: style.color,
            animationDuration: style.animationDuration,
            animationDelay: style.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleOverlay;