
import React, { useState, useEffect } from 'react';
import PdfViewerScreen from './PdfViewerScreen';
import BookerLoader from './BookerLoader';

const BookerScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    const loadResources = async () => {
      try {
        const timerPromise = new Promise(resolve => setTimeout(resolve, 3000));
        
        const pdfPromise = fetch('/booker-page.pdf')
          .then(res => {
            if (!res.ok) {
              throw new Error('Não foi possível encontrar o arquivo PDF do booker.');
            }
            return res.blob();
          })
          .then(blob => {
            objectUrl = URL.createObjectURL(blob);
            return objectUrl;
          });

        const [loadedPdfUrl] = await Promise.all([pdfPromise, timerPromise]);
        
        setPdfUrl(loadedPdfUrl);

      } catch (err: any) {
        console.error("Failed to load Booker PDF:", err);
        setError(err.message || 'Ocorreu um erro ao carregar o conteúdo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-40 text-warm-brown">
        <BookerLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 pt-24 text-center bg-white">
        <p className="text-coke-red font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold py-8 text-warm-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
          Área do Booker
        </h1>
        {pdfUrl && (
          <div className="flex justify-center">
             <PdfViewerScreen noPadding preloadedFileUrl={pdfUrl} pageKey="booker_static_page" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookerScreen;
