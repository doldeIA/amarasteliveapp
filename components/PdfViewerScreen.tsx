
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { loadPdfFromDb, savePdfToDb } from '../App';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerScreenProps {
  pageKey: string;
  fallbackPath?: string;
  preloadedFileUrl?: string | null;
  onPage1Rendered?: () => void;
  noPadding?: boolean;
}

const PdfViewerScreen: React.FC<PdfViewerScreenProps> = ({ pageKey, fallbackPath, preloadedFileUrl, onPage1Rendered, noPadding = false }) => {
  const [numPages, setNumPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    
    if (preloadedFileUrl) {
      setFileUrl(preloadedFileUrl);
      setIsLoading(false);
      return;
    }

    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let pdfBlob = await loadPdfFromDb(pageKey);

        if (!pdfBlob && fallbackPath) {
          const response = await fetch(fallbackPath);
          if (!response.ok) throw new Error(`O arquivo PDF principal não foi encontrado.`);
          pdfBlob = await response.blob();
          const file = new File([pdfBlob], `${pageKey}.pdf`, { type: "application/pdf" });
          await savePdfToDb(file, pageKey);
        }

        if (pdfBlob) {
          objectUrl = URL.createObjectURL(pdfBlob);
          setFileUrl(objectUrl);
        } else {
           setError(`Nenhum conteúdo foi configurado para esta página. Faça o upload de um PDF no Painel Admin.`);
        }
      } catch (e: any) {
        console.error(`Error loading PDF for pageKey "${pageKey}":`, e);
        setError(e.message || 'Não foi possível carregar o conteúdo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pageKey, fallbackPath, preloadedFileUrl]);

  // Effect to lazy-load subsequent pages after the first one is visible
  useEffect(() => {
    if (numPages > 1 && renderedPages < numPages) {
      const timer = setTimeout(() => {
        setRenderedPages(prev => prev + 1);
      }, 200); // Small delay between rendering each new page to avoid blocking
      return () => clearTimeout(timer);
    }
  }, [numPages, renderedPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setRenderedPages(1); // Ensure we start with one page
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 pt-24">
        <p className="text-white text-xl animate-pulse">Carregando conteúdo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 pt-24 text-center">
        <p className="text-accent font-bold">{error}</p>
      </div>
    );
  }
  
  if (!fileUrl) {
    // This case should ideally be covered by the error state, but it's a good fallback.
    return (
       <div className="flex min-h-screen items-center justify-center p-4 pt-24 text-center">
        <p className="text-accent font-bold">Conteúdo não encontrado.</p>
      </div>
    );
  }


  return (
    <div className={`w-full min-h-full ${noPadding ? '' : 'pt-24 pb-0'} px-2 flex flex-col items-center`}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center gap-y-8"
        loading={null} // We handle loading state above
        error={null} // We handle error state above
      >
        {Array.from(new Array(renderedPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-2xl shadow-accent/10"
            width={Math.min(pageWidth * 0.95, 1000)}
            onRenderSuccess={index === 0 ? onPage1Rendered : undefined}
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewerScreen;