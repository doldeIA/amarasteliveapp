
import React from 'react';

interface AdminHomePageProps {
  onBack: () => void;
}

const AdminHomePage: React.FC<AdminHomePageProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center p-4 animate-swoop-in">
      <div className="max-w-xl w-full mb-8">
        <img
          src="/amarastelive.jpg"
          alt="Amarasté Live Admin"
          className="w-full h-auto object-contain rounded-lg shadow-2xl shadow-accent/20"
        />
      </div>
      <button
        onClick={onBack}
        className="px-10 py-4 bg-white/10 border-2 border-accent text-accent font-bold text-lg rounded-lg shadow-lg transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 soft-neon"
        aria-label="Voltar para a página anterior"
      >
        Voltar
      </button>
    </div>
  );
};

export default AdminHomePage;
