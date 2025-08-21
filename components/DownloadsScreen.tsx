import React, { useState } from 'react';

interface DownloadsScreenProps {
  onBack: () => void;
}

const downloadLinks = [
  { name: 'Ansiedade', href: 'https://drive.google.com/file/d/10oyLOfgpIZjJJm9asNfvZ2Er5PcwM_X0/view?usp=sharing' },
  { name: 'Magical XXV', href: 'https://drive.google.com/file/d/14828uO75FMyIAILgHslnq_ugg2N6aste/view?usp=sharing' },
  { name: 'Jogos Psíquicos', href: 'https://drive.google.com/file/d/1jV9pAukVM5atMphA0y9C7MO2ZdQG6gQA/view?usp=sharing' },
  { name: 'Sobrexistir XXV', href: 'https://drive.google.com/file/d/1nfM_3O6svUcWgb6skF__O0-fLCFA8dAN/view?usp=sharing' },
  { name: 'Possibilidades', href: 'https://drive.google.com/file/d/1U95O5TRI4vCc5E0vvl8QMI8bT7I9Ve4-/view?usp=sharing' },
  { name: 'Explicar', href: 'https://drive.google.com/file/d/1DUUwZfKWeasKg4k1tsM-SSgq5ZLTH9p-/view?usp=sharing' },
];

const DownloadsScreen: React.FC<DownloadsScreenProps> = ({ onBack }) => {
  const [flashingButton, setFlashingButton] = useState<string | null>(null);
  const [showBackChoice, setShowBackChoice] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>, linkName: string, linkHref: string) => {
    e.preventDefault();
    if (flashingButton) return;

    setFlashingButton(linkName);

    setTimeout(() => {
      window.open(linkHref, '_blank', 'rel="noopener noreferrer"');
    }, 450);

    setTimeout(() => {
      setFlashingButton(null);
    }, 500);
  };

  if (showBackChoice) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 animate-swoop-in">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6 w-full max-w-md">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={onBack}
              className="w-full md:w-2/5 bg-transparent text-white text-xl px-4 py-2 rounded-lg ring-1 ring-white/50 hover:ring-white/80 transition hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              X
            </button>
            <button
              onClick={onBack}
              className="w-full md:w-2/5 bg-transparent text-white text-xl px-4 py-2 rounded-lg ring-1 ring-white/50 hover:ring-white/80 transition hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              Y
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-32 pb-12 bg-red-white-wide-stripes flex flex-col items-center justify-center animate-swoop-in">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-4">
        
        <div className="downloads-header max-w-2xl mx-auto mb-6">
            <p className="neon-heading-glow text-center text-white text-base md:text-lg lg:text-xl">
                Aqui você encontra faixas exclusivas em alta qualidade (.WAV), 
                livres da compressão de –14 LUFS imposta pelas plataformas de streaming. 
                Sinta a música em sua forma mais pura e potente
            </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
          {downloadLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleDownloadClick(e, link.name, link.href)}
              className={`neon-white-button font-bold tracking-wider text-lg text-center px-6 py-5 rounded-xl neon-float ${
                flashingButton === link.name ? 'green-flash' : ''
              }`}
              aria-label={`Download ${link.name}`}
            >
              {link.name}
            </a>
          ))}
        </div>
        
        <button 
          onClick={() => setShowBackChoice(true)}
          className="mt-16 bg-black/60 border-2 border-white/50 backdrop-blur-sm text-white font-semibold px-12 py-3 rounded-lg shadow-lg transition-all duration-300 hover:bg-white/20 hover:border-white hover:scale-105"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default DownloadsScreen;