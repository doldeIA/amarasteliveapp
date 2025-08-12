import React from 'react';

interface LandingScreenProps {
  onAccess: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAccess }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-transparent transition-opacity duration-500 overflow-hidden relative">
      {/* Neon Lines Overlay has been removed */}

      {/* Spacer to push content to the bottom */}
      <div className="flex-grow" />

      {/* Content at the bottom */}
      <div className="w-full max-w-md z-10 mb-4">
        <button
          onClick={onAccess}
          className="w-full relative z-10 text-white font-bold neon-pulse py-3 rounded-lg border border-white transition-transform duration-300 ease-in-out active:scale-95 bg-primary/50 backdrop-blur-sm"
          aria-label="Acessar conteúdo"
        >
          ACESSAR
        </button>
        <p className="text-sm text-center text-white/70 mt-2">
          Amaraste Live Music 2025º
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;