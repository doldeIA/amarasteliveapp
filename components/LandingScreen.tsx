import React from 'react';
import { playClickSound, applyClickAnimation } from '../App';

interface LandingScreenProps {
  onAccess: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAccess }) => {
  return (
    <>
      {/* This div receives the background image from the CSS in index.html */}
      <div className="landing-background" aria-hidden="true"></div>
      
      <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-transparent transition-opacity duration-500 overflow-hidden relative landing-content">
        {/* The logo is part of the mov.png background image */}
        
        {/* Spacer to push the button to the bottom, aligning with the image's composition */}
        <div className="flex-grow" />

        {/* Content at the bottom */}
        <div className="w-full max-w-md z-10 mb-4">
          <button
            onClick={(e) => {
              playClickSound();
              applyClickAnimation(e);
              onAccess();
            }}
            className="w-full relative z-10 text-white font-bold neon-pulse py-3 rounded-lg border border-white transition-transform duration-300 ease-in-out active:scale-95 bg-primary/50 backdrop-blur-sm"
            aria-label="Acessar conteúdo"
          >
            ACESSAR
          </button>
          {/* The subline "Amarasté Live Music 2025º" has been removed as per the request. */}
        </div>
      </div>
    </>
  );
};

export default LandingScreen;