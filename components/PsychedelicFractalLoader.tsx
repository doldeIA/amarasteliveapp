import React, { useRef, useEffect } from 'react';

const PsychedelicFractalLoader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastTime = useRef(0);
  const colorOffset = useRef(0);

  // Define a psychedelic color palette for the fractal
  const palette = [
    '#FF00FF', '#00FFFF', '#FFFF00', '#FF0000', '#00FF00', '#0000FF'
  ];

  const animate = (ctx: CanvasRenderingContext2D, vertices: {x: number, y: number}[], p: {x: number, y: number}) => {
    const now = Date.now();
    
    // Update color every ~300ms for a pulsing effect
    if (now - lastTime.current > 300) {
        colorOffset.current = (colorOffset.current + 1) % palette.length;
        lastTime.current = now;
    }

    ctx.fillStyle = palette[colorOffset.current];

    // "Chaos Game" - draw many points to form the fractal
    for (let i = 0; i < 1000; i++) {
        const targetVertex = vertices[Math.floor(Math.random() * 3)];
        p.x = (p.x + targetVertex.x) / 2;
        p.y = (p.y + targetVertex.y) / 2;
        ctx.fillRect(p.x, p.y, 1, 1);
    }
    
    animationFrameId.current = requestAnimationFrame(() => animate(ctx, vertices, p));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width * dpr;
    const height = rect.height * dpr;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas and set initial background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Define the 3 vertices of the main triangle for Sierpinski
    const margin = 50 * dpr;
    const vertices = [
      { x: width / 2, y: margin }, // Top vertex
      { x: margin, y: height - margin }, // Bottom-left vertex
      { x: width - margin, y: height - margin } // Bottom-right vertex
    ];
    
    // Starting point for the chaos game
    let p = { x: Math.random() * width, y: Math.random() * height };

    lastTime.current = Date.now();
    animate(ctx, vertices, p);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default PsychedelicFractalLoader;
