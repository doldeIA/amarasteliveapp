import React from 'react';

interface RevolucaoPageProps {
  onNavigateHome: () => void;
}

const RevolucaoPage: React.FC<RevolucaoPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="fixed inset-0 bg-[#3b2a1c] flex items-center justify-center p-4 animate-swoop-in">
      <div className="text-center">
        <button
          onClick={onNavigateHome}
          className="px-10 py-5 bg-white/10 border-2 border-accent text-accent font-bold text-lg rounded-lg shadow-lg transition-all duration-300 hover:bg-accent hover:text-warm-brown hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 soft-neon"
        >
          Voltar à Página Inicial
        </button>
      </div>
    </div>
  );
};

export default RevolucaoPage;
