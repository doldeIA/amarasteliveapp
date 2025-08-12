
import React, { useState, useEffect } from 'react';
import UploadIcon from './icons/UploadIcon';

interface PageFormProps {
  pageKey: string;
  pageLabel: string;
  onUpload: (file: File, pageKey: string) => Promise<void>;
  onRemove: (pageKey: string) => Promise<void>;
}

type Status = { type: 'idle' | 'success' | 'error'; message: string };

const PageForm: React.FC<PageFormProps> = ({ pageKey, pageLabel, onUpload, onRemove }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });

  // Reset form when pageKey changes
  useEffect(() => {
    setSelectedFile(null);
    setIsProcessing(false);
    setShowSaveConfirm(false);
    setShowRemoveConfirm(false);
    setStatus({ type: 'idle', message: '' });
  }, [pageKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ type: 'idle', message: '' });
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        setStatus({ type: 'error', message: 'Por favor, selecione um arquivo PDF.' });
        setSelectedFile(null);
      }
    }
  };

  const handleSaveClick = () => {
    if (selectedFile) {
        setShowSaveConfirm(true);
    }
  };

  const handleConfirmSave = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setStatus({ type: 'idle', message: '' });
    setShowSaveConfirm(false);
    
    try {
        await onUpload(selectedFile, pageKey);
        setStatus({ type: 'success', message: 'PDF salvo com sucesso!' });
        setSelectedFile(null); // Clear selection after successful upload
    } catch (error) {
        setStatus({ type: 'error', message: 'Falha ao salvar. Tente novamente.' });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleConfirmRemove = async () => {
    setIsProcessing(true);
    setStatus({ type: 'idle', message: '' });
    setShowRemoveConfirm(false);

    try {
        await onRemove(pageKey);
        setStatus({ type: 'success', message: 'PDF removido com sucesso!' });
    } catch (error) {
        setStatus({ type: 'error', message: 'Falha ao remover. Tente novamente.' });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const renderConfirmationModal = (
    title: string,
    body: string,
    onConfirm: () => void,
    onCancel: () => void,
  ) => (
     <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl ring-1 ring-gray-300 p-6 w-full max-w-sm text-center animate-swoop-in">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
            </h3>
            <p className="mt-2 text-gray-600">{body}</p>
            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-md text-coke-red font-semibold ring-1 ring-coke-red hover:bg-red-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2 rounded-md text-white font-bold bg-coke-red hover:bg-red-700 transition-colors"
                >
                    Confirmar
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="relative p-6 space-y-6">
      <h3 className="text-xl font-semibold text-coke-red">{pageLabel}</h3>
      
      <div>
        <label htmlFor={`pdf-upload-${pageKey}`} className="block text-sm font-medium text-gray-700 mb-2">
          Selecione o arquivo PDF
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-coke-red/50 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-coke-red/70" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={`pdf-upload-${pageKey}`}
                className="relative cursor-pointer bg-white rounded-md font-medium text-coke-red hover:text-red-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-coke-red px-1"
              >
                <span>Carregar um arquivo</span>
                <input id={`pdf-upload-${pageKey}`} name={`pdf-upload-${pageKey}`} type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-gray-500 w-64 truncate" title={selectedFile?.name}>
              {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={!selectedFile || isProcessing}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-coke-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coke-red disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? 'Processando...' : 'Salvar Alterações'}
        </button>
        <button
          type="button"
          onClick={() => setShowRemoveConfirm(true)}
          disabled={isProcessing}
          className="w-full sm:w-auto flex justify-center py-3 px-6 border border-coke-red rounded-md shadow-sm text-sm font-bold text-coke-red bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coke-red disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Remover PDF
        </button>
      </div>

      {status.message && (
        <p className={`text-sm font-semibold text-center mt-2 ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {status.message}
        </p>
      )}

      {showSaveConfirm && renderConfirmationModal(
        'Confirmar Alteração',
        'Deseja substituir o PDF atual desta página? Esta ação é permanente.',
        handleConfirmSave,
        () => setShowSaveConfirm(false)
      )}

      {showRemoveConfirm && renderConfirmationModal(
        'Confirmar Remoção',
        'Deseja remover o PDF desta página? A página voltará ao seu estado padrão.',
        handleConfirmRemove,
        () => setShowRemoveConfirm(false)
      )}
    </div>
  );
};

export default PageForm;
