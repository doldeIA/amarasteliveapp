import React from 'react';
import PdfViewerScreen from './PdfViewerScreen';
import SparkleOverlay from './SparkleOverlay';
import { Screen } from '../App';

interface EcossistemaPageProps {
  onNavigate: (screen: Screen) => void;
}

const EcossistemaPage: React.FC<EcossistemaPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full bg-black">
      <SparkleOverlay />
      <PdfViewerScreen 
        pageKey="portalMagico"
        fallbackPath="/ecossistema.pdf" 
      />
      <div className="w-full flex justify-center mt-2.5 mb-12 px-4">
        <button
          onClick={() => onNavigate('revolucao')}
          className="w-full max-w-md px-8 py-4 bg-crimson-red text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] active:scale-100"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Revolução
        </button>
      </div>
    </div>
  );
};

export default EcossistemaPage;