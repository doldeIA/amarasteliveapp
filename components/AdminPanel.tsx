
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import PageForm from './PageForm';

interface AdminPanelProps {
  onClose: () => void;
  onUpload: (file: File, pageKey: string) => Promise<void>;
  onRemove: (pageKey: string) => Promise<void>;
}

const pages = [
  { key: 'pdf', label: 'Manifesto Principal' },
  { key: 'booker', label: 'PDF para Booker' },
  { key: 'portalMagico', label: 'PDF para Portal Mágico' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onUpload, onRemove }) => {
  const [activePageKey, setActivePageKey] = useState<string>('pdf');

  const activePage = pages.find(p => p.key === activePageKey) || pages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-swoop-in" aria-modal="true" role="dialog">
      <div className="relative flex flex-col w-[90%] max-w-2xl h-[85vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="relative flex items-center justify-between p-4 bg-coke-red text-white">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Administrador
          </h2>
          <button
            onClick={onClose}
            className="text-white rounded-full p-2 transition-colors hover:bg-white/20"
            aria-label="Close admin panel"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-shrink-0 flex border-b border-gray-200">
          {pages.map(page => (
            <button
              key={page.key}
              onClick={() => setActivePageKey(page.key)}
              className={`flex-1 py-3 px-2 text-sm font-bold transition-colors duration-200 focus:outline-none
                ${activePageKey === page.key 
                  ? 'text-coke-red border-b-2 border-coke-red' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`
              }
              aria-current={activePageKey === page.key ? 'page' : undefined}
            >
              {page.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <PageForm
            key={activePage.key}
            pageKey={activePage.key}
            pageLabel={activePage.label}
            onUpload={onUpload}
            onRemove={onRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
