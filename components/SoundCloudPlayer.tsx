import React from 'react';
import PdfViewerScreen from './PdfViewerScreen';
import { playClickSound, applyClickAnimation } from '../App';

interface SoundCloudPlayerProps {
  onTalkAboutMusic: () => void;
  onOpenSignUpModal: () => void;
}

const SoundCloudPlayer: React.FC<SoundCloudPlayerProps> = ({ onTalkAboutMusic, onOpenSignUpModal }) => {
  const embedUrl = "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/amarastelive/explicar-a-garrafa&visual=true";

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-2">

      <div className="relative p-1 rounded-lg bg-black neon-border">
        <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
            <iframe
              title="Explicar a Garrafa"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full touch-none"
            />
        </div>
      </div>
      
      <div className="glow-line mt-2 mb-2" />
      
      <PdfViewerScreen 
        pageKey="home2" 
        fallbackPath="/home2.pdf" 
        noPadding 
      />
      
      {/* The "Explique a 'Garrafa'" button and Bandcamp player have been removed as per the request. */}
      
      <div className="w-full flex justify-center mt-6">
        <button
          onClick={(e) => {
            playClickSound();
            applyClickAnimation(e);
            onOpenSignUpModal();
          }}
          className="cadastre-btn"
          aria-label="Cadastre-se"
        >
          Cadastre-se
        </button>
      </div>

      <p className="home-copyright mt-4">
        Direitos Autorais © 2025 Amarasté Live
      </p>
    </div>
  );
};

export default SoundCloudPlayer;