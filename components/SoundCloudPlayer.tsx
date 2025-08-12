

import React from 'react';
import PdfViewerScreen from './PdfViewerScreen';

interface SoundCloudPlayerProps {
  onTalkAboutMusic: () => void;
}

const SoundCloudPlayer: React.FC<SoundCloudPlayerProps> = ({ onTalkAboutMusic }) => {
  const embedUrl = "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/amarastelive/explicar-a-garrafa&visual=true";

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">

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
      
      <div>
        <button
          onClick={onTalkAboutMusic}
          style={{ animation: 'blinkFast 0.15s infinite ease-in-out', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.8))' }}
          className="
            w-full py-4 
            bg-gradient-to-r from-red-700 via-amber-300 to-red-700
            text-white font-bold
            rounded-lg
            shadow-lg
            transition-transform duration-200 active:scale-95
            focus:outline-none
          "
        >
          Explique a ‘Garrafa’
        </button>
      </div>
    </div>
  );
};

export default SoundCloudPlayer;