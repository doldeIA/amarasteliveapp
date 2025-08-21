import React from 'react';
import { playClickSound, applyClickAnimation } from '../App';

interface WelcomePageProps {
  onBackToChat: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onBackToChat }) => {
  return (
    <div className="fixed inset-0 bg-deep-brown z-50 flex flex-col items-center justify-center p-4 animate-swoop-in">
      <h1 className="text-white text-3xl md:text-4xl font-bold text-center welcome-text-glow">
        Sinta-se em casa...
      </h1>
      <button
        onClick={(e) => {
          playClickSound();
          applyClickAnimation(e);
          onBackToChat();
        }}
        className="cadastre-btn mt-6"
        aria-label="Voltar ao chat"
      >
        Voltar
      </button>
    </div>
  );
};

export default WelcomePage;
