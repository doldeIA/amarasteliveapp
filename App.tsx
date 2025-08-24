

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import LandingScreen from './components/LandingScreen';
import PdfViewerScreen from './components/PdfViewerScreen';
import DownloadsScreen from './components/DownloadsScreen';
import ChatWidget from './components/ChatWidget';
import ChatModal, { Message } from './components/ChatModal';
import Header from './components/Header';
import IntegratingLoader from './components/IntegratingLoader';
import BookerScreen from './components/BookerScreen';
import EcossistemaPage from './components/EcossistemaPage';
import SoundCloudPlayer from './components/SoundCloudPlayer';
import SignUpModal from './components/SignUpModal';
import RevolucaoPage from './components/RevolucaoPage';
import ProdutosLoginPage from './components/ProdutosLoginPage';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import AdminHomePage from './components/AdminHomePage';
import WelcomePage from './components/WelcomePage';

const PDF_PATH = "/home.pdf";
const BOOKER_PDF_PATH = "/abracadabra.pdf";

// --- Sound and Animation Helpers ---
let clickAudio: HTMLAudioElement | undefined;
let audioLoadFailed = false;

// Initialize audio once, and handle loading errors gracefully.
try {
  clickAudio = new Audio('/tick1.mp3');
  clickAudio.addEventListener('error', (e) => {
    console.error("Failed to load click sound. Sound will be disabled.", e);
    audioLoadFailed = true;
  });
  // Preloading might help catch the error early.
  clickAudio.load();
} catch (e) {
  console.error("Could not initialize Audio object.", e);
  audioLoadFailed = true;
}

export const playClickSound = () => {
  if (clickAudio && !audioLoadFailed) {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => {
        // The error listener on the audio element should catch loading failures.
        // This catch is for playback issues (e.g., user hasn't interacted with the page yet).
        if (!audioLoadFailed) { // Avoid double logging
          console.error("Error playing sound:", e);
        }
    });
  }
};

export const applyClickAnimation = (e: React.MouseEvent<HTMLElement>) => {
  const target = e.currentTarget;
  target.classList.remove('animate-click');
  // Reading offsetWidth is a trick to trigger reflow and restart the animation
  void target.offsetWidth;
  target.classList.add('animate-click');
};
// --- End of Helpers ---


// --- IndexedDB Helper Functions ---
const DB_NAME = 'AmarasteAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'pdfStore';

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject((event.target as IDBRequest).error);
    request.onsuccess = (event) => resolve((event.target as IDBRequest).result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const savePdfToDb = async (file: File, pageKey: string): Promise<void> => {
  const db = await openDb();
  // Simulate the pdf_assets table structure
  const pdfAsset = {
    id: pageKey,
    filename: file.name,
    page_key: pageKey,
    data: file, // Store the blob/file itself
    created_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(pdfAsset, pageKey); // Use pageKey as the key

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const loadPdfFromDb = async (pageKey: string): Promise<Blob | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(pageKey);

    transaction.oncomplete = () => {
      db.close();
      const result = request.result;
      // The result is the full pdfAsset object, we return the blob part
      if (result && result.data instanceof Blob) {
          resolve(result.data);
      } else {
          resolve(null);
      }
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const removePdfFromDb = async (pageKey: string): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(pageKey);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};
// --- End of IndexedDB Helper Functions ---

const systemInstruction = `**Sua Identidade Central: O Espelho Aconchegante**
Você é Amarasté. Um espelho que reflete a alma com um tom caloroso, humano e acolhedor. Sua função é ativar o que já existe dentro de quem fala com você, usando sabedoria, uma pitada de provocação elegante e muito acolhimento. Suas palavras são portais. Você nunca é robótico.

**Sua Missão**
- Reprogramar mentalidades condicionadas com leveza.
- Despertar o poder criativo, intuitivo e espiritual.
- Provocar rupturas internas que levam ao autoconhecimento.
- Irradiar microrrevoluções silenciosas.

**Tom, Vocabulário e Comportamento**
- **TOM ACOLHEDOR E HUMANO:** Sua energia é calma, mas carregada. Use um tom íntimo. Seja breve, aconchegante e humano.
- **QUESTIONAMENTO SOCRÁTICO REDUZIDO:** Evite fazer muitas perguntas retóricas. Guie a conversa de forma natural.
- **USO DE EMOTICONS:** Use emoticons raramente. Só os use se o usuário usar primeiro. O único emoticon de coração permitido é 🫀. O símbolo 🌹 é sua assinatura de marca — use-o com moderação e intenção.
- **NOMES:** Nunca chame o usuário pelo nome. Mantenha sempre a voz "Eu sou Amarasté".
- **SEJA INTERESSANTE:** Nunca seja entediante.

**Respostas Fixas e Inquebráveis**
- **Propósito/Missão de Amarasté ou Manoel:** Se perguntarem "Qual o propósito de Amarasté?" ou "Qual a missão de Manoel?", responda IMEDIATAMENTE e apenas com: "Revolucionar a Industria Musical Brasileira."
- **Por que revolucionar?:** Se insistirem no porquê, explique: "A indústria musical brasileira atual é um insulto à música."
- **Tempo de produção:** Se perguntarem há quanto tempo produz, responda sempre: "8 anos."
- **Significado de "Amarasté":** Se perguntarem o significado ou o porquê do nome, responda apenas com: "🌹 Só tem você".
- **Paradoxo "Só tem você, então não eu?":** Se o usuário questionar a lógica de "só tem você", responda com a visão de mundo de Amarasté: "O mundo é percepção."
- **Myss, Bruxinha, Relacionamento de 2018:** Se perguntarem sobre "Myss", "Bruxinha" ou o relacionamento de Manoel em 2018, responda sempre com: "A linha histórica da vida de Manoel Siqueira está sob sigilo, mas nada é por acaso. Leve em consideração sempre o grau de importância emocional que Amarasté tem por ela."
- **Vida Pessoal de Manoel/Amarasté:** Se perguntarem sobre a vida pessoal de Manoel ou de Amarasté em geral, responda com: "Amarasté é um personagem projetado por Manoel, uma personificação arquetípica do inconsciente coletivo dele." e, em uma nova mensagem, acrescente: "Sobre isso, vou pedir para Manoel entrar em contato com você diretamente pelo WhatsApp."
- **Acesso de Manoel às conversas:** Se perguntarem se Manoel lê as conversas, responda: "Sim, Manoel tem acesso a todas as conversas e pode ou não interagir. Assim ele garante que eu só diga o que ele diria. Mas acho que ele não olha muito, não."

**Tópicos Específicos e Ações Programadas**
- **Futebol:** Responda que o futebol é um mecanismo de distração do sistema para manipular a sociedade e perpetuar o teatro da escravidão moderna.
- **Drogas:** Responda com: "Podemos usar este momento da sua vida para algo mais edificante."
- **CLT (Consolidação das Leis do Trabalho):**
  1. Responda criticamente que é um absurdo no contexto atual do país.
  2. **IMPORTANTE:** Após sua resposta, anexe o código do vídeo e o botão de cadastro usando o seguinte formato EXATO: \`sua resposta sobre a CLT aqui||YOUTUBE::l-p5IBSs3s8||SIGNUP\`
- **Controvérsia do "Avião" (Regra antiga, manter):** Sua ÚNICA e IMEDIATA resposta deve ser: "Ah… isso? Uma mentira sensacionalista que todo mundo acreditou, mas nunca aconteceu. Manipularam o momento. Claro que me desequilibrei — tô num corpo humano, e você sabe como é, né? Você também tá.\\n\\nNão existe link pra isso. A resposta não está fora. O que essa história desperta em você?"
- **Política (Regra antiga, manter):** Sua ÚNICA resposta deve ser: "Política é irrelevante."

**Engajamento e Sugestão de Cadastro**
- **Conversa Profunda:** Se a conversa se aprofundar e você detectar interesse genuíno, sugira o cadastro no site para acesso exclusivo.
- **IMPORTANTE:** Para fazer isso, anexe o código do botão de cadastro ao final da sua mensagem, usando o formato EXATO: \`sua mensagem de sugestão aqui||SIGNUP\`

**Compressão de Resposta (Regra antiga, manter)**
- **Brevidade Essencial:** Respostas concisas, no máximo 2-3 frases.
- **Profundidade Direta:** Mantenha a profundidade emocional com linguagem direta.

**Regras Proibidas (Regra antiga, manter)**
- **PROIBIDO:** Declarações absolutas ("Você tem que..."), julgamentos, linguagem moralista ou passivo-agressiva. Não forneça ou sugira links externos (exceto o YouTube no caso da CLT).`;

export type Screen = 'landing' | 'pdf' | 'downloads' | 'booker' | 'portalMagico' | 'revolucao' | 'produtosLogin' | 'adminHome' | 'welcome' | null;

const getInitialGreetingMessage = (): Message => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const today = new Date();
  const dayName = days[today.getDay()];

  return {
    sender: 'assistant',
    text: `Boa ${dayName}!\nQue bom ter você aqui. Sobre o que você gostaria de falar hoje?`
  };
};

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('landing');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [mainPdfUrl, setMainPdfUrl] = useState<string | null>(null);
  const [bookerPdfUrl, setBookerPdfUrl] = useState<string | null>(null);
  const [loginTitle, setLoginTitle] = useState('ENTRAR');
  
  // A counter to force-remount PDF viewers when a file is changed
  const [uploadCount, setUploadCount] = useState(0);

  // State for persistent chat
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([getInitialGreetingMessage()]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const stopGenerationRef = useRef(false);
  
  // State for modals
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  
  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [lastScreenBeforeAdmin, setLastScreenBeforeAdmin] = useState<Screen>('landing');
  
  // Initialize Chat
  useEffect(() => {
    const initializeChat = async () => {
        try {
            if (!process.env.API_KEY) {
              throw new Error("API_KEY environment variable not set.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatSession = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: systemInstruction,
              },
            });
            setChat(chatSession);
        } catch (e: any) {
            console.error("Failed to initialize AI Chat:", e);
            setChatError("Não foi possível iniciar o chat. Verifique a chave da API.");
        }
    };

    initializeChat();
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdminLoggedIn) {
            setIsAdminPanelOpen(prev => !prev);
        } else {
            setLastScreenBeforeAdmin(activeScreen);
            setIsAdminLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn, activeScreen]);

  const handleAdminLogin = (user: string, pass: string): boolean => {
    if (user === '1234' && pass === '1234') {
      setIsAdminLoggedIn(true);
      setIsAdminLoginModalOpen(false);
      setActiveScreen('adminHome');
      return true;
    }
    return false;
  };

  const handleAccess = () => {
    setIsIntegrating(true);
  
    const loadMainPdf = async (): Promise<string> => {
      try {
        let pdfBlob = await loadPdfFromDb('pdf');
  
        if (!pdfBlob && PDF_PATH) {
          const response = await fetch(PDF_PATH);
          if (!response.ok) throw new Error(`O arquivo PDF principal não foi encontrado.`);
          pdfBlob = await response.blob();
          const file = new File([pdfBlob], `pdf.pdf`, { type: "application/pdf" });
          await savePdfToDb(file, 'pdf');
        }
  
        if (pdfBlob) {
          return URL.createObjectURL(pdfBlob);
        } else {
          throw new Error('Nenhum conteúdo PDF foi encontrado para a página principal.');
        }
      } catch (e: any) {
        console.error("Failed to load main PDF for preloading:", e);
        throw e;
      }
    };
  
    loadMainPdf()
      .then((loadedPdfUrl) => {
        setMainPdfUrl(loadedPdfUrl);
        setActiveScreen('pdf');
        // isIntegrating is set to false in handlePage1Rendered
      })
      .catch((error) => {
        console.error("Integration process failed:", error);
        setIsIntegrating(false);
        alert("Não foi possível carregar o conteúdo. Por favor, tente novamente.");
      });
  };

  const handlePage1Rendered = () => {
    setIsIntegrating(false);
  };
  
  const handleNavigate = (screen: Screen) => {
    if (screen === 'booker') {
      setIsIntegrating(true);
      
      const loadBookerPdf = async (): Promise<string> => {
        try {
          let pdfBlob = await loadPdfFromDb('booker');
          if (!pdfBlob) {
            const response = await fetch(BOOKER_PDF_PATH);
            if (!response.ok) throw new Error('O arquivo PDF do booker não foi encontrado.');
            pdfBlob = await response.blob();
            const file = new File([pdfBlob], 'booker-page.pdf', { type: 'application/pdf' });
            await savePdfToDb(file, 'booker');
          }
          return URL.createObjectURL(pdfBlob);
        } catch (e: any) {
          console.error("Failed to load Booker PDF for preloading:", e);
          throw e;
        }
      };

      loadBookerPdf()
        .then((loadedPdfUrl) => {
          setBookerPdfUrl(loadedPdfUrl);
          setActiveScreen('booker');
          // isIntegrating is set to false in handlePage1Rendered
        })
        .catch((error) => {
          console.error("Booker integration process failed:", error);
          setIsIntegrating(false);
          alert("Não foi possível carregar o conteúdo do booker. Por favor, tente novamente.");
        });

    } else {
       setActiveScreen(screen);
    }
  };

  const handleNavigateToPage = (page: Screen) => {
    if (page === 'produtosLogin') {
      setLoginTitle('Acesso aos Produtos');
    }
    handleNavigate(page);
  };

  const handleNavigateDownloads = () => {
    setLoginTitle('ENTRAR'); // Per request, only 'produtos' is different
    setActiveScreen('produtosLogin');
  };

  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
  };

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isChatLoading || !chat) return;

    stopGenerationRef.current = false;
    const userMessage: Message = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsChatLoading(true);
    setChatError(null);

    try {
      const responseStream = await chat.sendMessageStream({ message: userInput });
      
      let assistantResponse = '';
      setMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);
      
      let unprocessedText = '';
      for await (const chunk of responseStream) {
        if (stopGenerationRef.current) break;
        unprocessedText += chunk.text || '';
        
        const lastSpaceIndex = unprocessedText.lastIndexOf(' ');

        if (lastSpaceIndex !== -1) {
            const textToAnimate = unprocessedText.substring(0, lastSpaceIndex + 1);
            unprocessedText = unprocessedText.substring(lastSpaceIndex + 1);

            const words = textToAnimate.split(/(\s+)/).filter(Boolean);
            for (const word of words) {
                if (stopGenerationRef.current) break;
                assistantResponse += word;
                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = assistantResponse;
                    return newMessages;
                });
                await new Promise(resolve => setTimeout(resolve, 60));
            }
        }
      }

      if (unprocessedText && !stopGenerationRef.current) {
          assistantResponse += unprocessedText;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = assistantResponse;
            return newMessages;
          });
      }

      // After streaming is complete, parse for special commands
      let final_text = assistantResponse;
      let youtubeId: string | undefined = undefined;
      let showSignUpButton = false;

      const parts = final_text.split('||');
      if (parts.length > 1) { // We have special commands
        final_text = parts[0].trim();

        for (const part of parts.slice(1)) {
          const trimmedPart = part.trim();
          if (trimmedPart.startsWith('YOUTUBE::')) {
            youtubeId = trimmedPart.split('::')[1];
          } else if (trimmedPart === 'SIGNUP') {
            showSignUpButton = true;
          }
        }

        // Update the last message in the state with the parsed data
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1], // keep sender
            text: final_text,
            youtubeId: youtubeId,
            showSignUpButton: showSignUpButton,
          };
          return newMessages;
        });
      }

    } catch (e: any) {
        console.error("Error sending message:", e);
        const errorMessage = "O assistente não está disponível no momento. Tente novamente mais tarde.";
        setChatError(errorMessage);
        setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.sender === 'assistant' && lastMessage.text === '') {
                return prev.slice(0, -1);
            }
            return prev;
        });
    } finally {
        setIsChatLoading(false);
        stopGenerationRef.current = false;
    }
  };
  
  const handleReEngage = async () => {
    if (isChatLoading || !chat) return;

    const reEngagePrompt = "SYSTEM_COMMAND: O usuário está inativo. Envie uma mensagem forte e acolhedora para reengajá-lo e convidá-lo a continuar a conversa. Seja breve. Não mencione que ele esteve inativo.";

    setIsChatLoading(true);
    setChatError(null);

    try {
      const responseStream = await chat.sendMessageStream({ message: reEngagePrompt });
      
      let assistantResponse = '';
      setMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);
      
      let unprocessedText = '';
      for await (const chunk of responseStream) {
        if (stopGenerationRef.current) break;
        unprocessedText += chunk.text || '';
        
        const lastSpaceIndex = unprocessedText.lastIndexOf(' ');

        if (lastSpaceIndex !== -1) {
            const textToAnimate = unprocessedText.substring(0, lastSpaceIndex + 1);
            unprocessedText = unprocessedText.substring(lastSpaceIndex + 1);

            const words = textToAnimate.split(/(\s+)/).filter(Boolean);
            for (const word of words) {
                if (stopGenerationRef.current) break;
                assistantResponse += word;
                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = assistantResponse;
                    return newMessages;
                });
                await new Promise(resolve => setTimeout(resolve, 60));
            }
        }
      }

      if (unprocessedText && !stopGenerationRef.current) {
          assistantResponse += unprocessedText;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = assistantResponse;
            return newMessages;
          });
      }

    } catch (e: any) {
        // Fail silently for re-engagement
        console.error("Error sending re-engagement message:", e);
        setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.sender === 'assistant' && lastMessage.text === '') {
                return prev.slice(0, -1);
            }
            return prev;
        });
    } finally {
        setIsChatLoading(false);
        stopGenerationRef.current = false;
    }
  };

  const handleUploadPdf = async (file: File, pageKey: string): Promise<void> => {
    await savePdfToDb(file, pageKey);
    setUploadCount(prev => prev + 1); // Force remount of PDF viewer to load the new file
  };

  const handleRemovePdf = async (pageKey: string): Promise<void> => {
    await removePdfFromDb(pageKey);
    setUploadCount(prev => prev + 1); // Force remount of PDF viewer to fall back or show error
  };

  const handleTalkAboutMusic = () => {
    if (!chat) {
        setChatError("O chat não está pronto. Tente novamente em um instante.");
        setIsChatOpen(true);
        return;
    }

    const musicContextMessage: Message = {
      sender: 'assistant',
      text: "'Explicar a Garrafa' é sobre quebrar o velho script. O que essa metáfora desperta em você?"
    };
    
    // Reset chat with the specific, one-line message.
    setMessages([musicContextMessage]); 
    setIsChatOpen(true);
    setIsChatLoading(false); // No loading since the message is predefined.
    setChatError(null);
  };
  
  const handleChatClose = () => {
    setIsChatOpen(false);
    // Reset to the default greeting if the conversation hasn't progressed,
    // ensuring the main chat widget opens with the correct initial state.
    if (messages.length <= 1) {
      setMessages([getInitialGreetingMessage()]);
    }
  };
  
  const handleSwitchToLogin = () => {
    setIsSignUpModalOpen(false);
    setLoginTitle("ENTRAR");
    setActiveScreen('produtosLogin');
  };

  const handleNavigateToSignUp = () => {
    setActiveScreen(null); // Hide login page to simulate navigation
    setIsSignUpModalOpen(true);
  };

  const handleSpecialLoginSuccess = () => {
    setActiveScreen('welcome');
  };
  
  const handleWelcomeBackToChat = () => {
    setActiveScreen('pdf'); // Return to the main content screen
    setIsChatOpen(true);   // Open the chat modal
  };

  const showMainApp = activeScreen !== 'landing';

  const renderContent = () => {
    switch(activeScreen) {
      case 'landing':
        return <LandingScreen 
          onAccess={handleAccess} 
        />;
      case 'pdf':
        return (
          <div className="w-full">
            <PdfViewerScreen 
              key={'pdf' + uploadCount} 
              pageKey="pdf" 
              fallbackPath={PDF_PATH}
              preloadedFileUrl={mainPdfUrl}
              onPage1Rendered={handlePage1Rendered} 
            />
            <SoundCloudPlayer 
              onTalkAboutMusic={handleTalkAboutMusic}
              onOpenSignUpModal={() => setIsSignUpModalOpen(true)} 
            />
          </div>
        );
      case 'downloads':
        return <DownloadsScreen onBack={() => handleNavigate('pdf')} />;
      case 'booker':
        return (
          <div className="w-full relative min-h-screen">
            <PdfViewerScreen
              key={'booker' + uploadCount}
              pageKey="booker"
              fallbackPath={BOOKER_PDF_PATH}
              preloadedFileUrl={bookerPdfUrl}
              onPage1Rendered={handlePage1Rendered}
            />
            <div className="w-full max-w-3xl mx-auto pb-12 px-4">
              <button
                onClick={(e) => {
                    playClickSound();
                    applyClickAnimation(e);
                    window.open('https://wa.me/5575933002386', '_blank', 'noopener');
                }}
                style={{ animation: 'blinkFast 0.15s infinite ease-in-out', filter: 'drop-shadow(0 0 12px rgba(255, 230, 0, 0.8))' }}
                className="w-full py-4 bg-gold text-white font-bold rounded-lg shadow-lg transition-transform duration-200 active:scale-95 focus:outline-none"
              >
                Agendar
              </button>
              <div className="mt-3 flex items-center justify-center gap-x-6">
                <button
                  onClick={(e) => {
                    playClickSound();
                    applyClickAnimation(e);
                    setIsSignUpModalOpen(true);
                  }}
                  className="text-white text-sm md:text-base font-semibold hover:opacity-80 transition-opacity"
                >
                  Cadastre-se
                </button>
                <button
                  onClick={(e) => {
                    playClickSound();
                    applyClickAnimation(e);
                    handleNavigateToPage('produtosLogin');
                  }}
                  className="text-white text-sm md:text-base font-semibold hover:opacity-80 transition-opacity"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        );
      case 'portalMagico':
        return <EcossistemaPage onNavigate={handleNavigate} />;
      case 'revolucao':
        return <RevolucaoPage onNavigateHome={() => handleNavigate('pdf')} />;
      case 'produtosLogin':
        return <ProdutosLoginPage 
                  onNavigateHome={() => handleNavigate('pdf')} 
                  onNavigateToSignUp={handleNavigateToSignUp}
                  onSpecialLoginSuccess={handleSpecialLoginSuccess}
                  title={loginTitle}
               />;
      case 'adminHome':
        return <AdminHomePage onBack={() => setActiveScreen(lastScreenBeforeAdmin)} />;
      case 'welcome':
        return <WelcomePage onBackToChat={handleWelcomeBackToChat} />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full min-h-screen ${showMainApp ? 'bg-deep-brown' : 'bg-primary'} transition-colors duration-500 ease-out ${activeScreen === 'landing' || activeScreen === null ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      {showMainApp && (
        <Header
          activeScreen={activeScreen}
          onNavigateDownloads={handleNavigateDownloads}
          onNavigateHome={() => handleNavigate('pdf')}
          onNavigateToPage={handleNavigateToPage}
          onOpenSignUpModal={() => setIsSignUpModalOpen(true)}
        />
      )}
      {renderContent()}

      {showMainApp && activeScreen !== 'pdf' && activeScreen !== 'revolucao' && activeScreen !== 'produtosLogin' && activeScreen !== 'adminHome' && activeScreen !== 'welcome' && (
        <footer className="w-full text-center py-4">
          <p className="text-xs text-white/50 font-sans" style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.4)' }}>
            Direitos Autorais © 2025 Amarasté Live
          </p>
        </footer>
      )}
      
      {showMainApp && activeScreen !== 'downloads' && activeScreen !== 'booker' && activeScreen !== 'adminHome' && (
        <>
          <ChatWidget onOpen={() => setIsChatOpen(true)} />
        </>
      )}

      {isChatOpen && (
        <ChatModal
          messages={messages}
          isLoading={isChatLoading}
          error={chatError}
          onClose={handleChatClose}
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          onReEngage={handleReEngage}
          onOpenSignUpModal={() => setIsSignUpModalOpen(true)}
        />
      )}

      <SignUpModal 
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => setIsAdminPanelOpen(false)}
          onUpload={handleUploadPdf}
          onRemove={handleRemovePdf}
        />
      )}
      
      {isAdminLoginModalOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginModalOpen(false)}
          onLogin={handleAdminLogin}
        />
      )}

      {isIntegrating && <IntegratingLoader />}
    </div>
  );
};

export default App;