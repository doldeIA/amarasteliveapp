
import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import RotatingCircleIcon from './icons/RotatingCircleIcon';
import AssistantAvatar from './AssistantAvatar';

export interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface ChatModalProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSendMessage: (input: string) => Promise<void>;
  onStopGeneration: () => void;
}

/**
 * Renders text with support for simple markdown (bold).
 * - Guards against null/undefined text values.
 * - While streaming, it shows plain text without asterisks.
 * - When final, it renders text within asterisks as bold.
 */
const renderFormattedText = (text: string, isFinal: boolean) => {
  // Guard against null/undefined text to prevent rendering "undefined"
  const cleanText = String(text ?? '').trim();

  if (!isFinal) {
    // During streaming, just remove asterisks to show plain text.
    return <>{cleanText.replace(/\*/g, '')}</>;
  }

  // Once final, parse for markdown bold.
  // Split the text by words enclosed in asterisks, keeping the delimiters.
  const parts = cleanText.split(/(\*.*?\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          // It's a bold part, render it with <strong>
          return <strong key={i}>{part.substring(1, part.length - 1)}</strong>;
        }
        // It's a normal text part
        return part;
      })}
    </>
  );
};


const ChatModal: React.FC<ChatModalProps> = ({
  messages,
  isLoading,
  error,
  onClose,
  onSendMessage,
  onStopGeneration,
}) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Removed typewriter effect for initial message to make it appear instantly.
  useEffect(() => {
    if (autoScroll && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(isAtBottom);
  };

  const handleLocalSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    const currentInput = userInput;
    setUserInput('');
    setAutoScroll(true); // Re-enable autoscroll on send
    await onSendMessage(currentInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" aria-modal="true" role="dialog">
      <div className="flex flex-col w-[90%] max-w-lg h-[80vh] max-h-[700px] bg-[#F5E3D0] rounded-2xl shadow-2xl ring-1 ring-warm-brown/10 animate-swoop-in">
        
        <div className="relative flex items-center gap-3 sm:gap-4 text-warm-brown px-4 py-4 border-b border-warm-brown/10">
          <AssistantAvatar />
          <div className="flex-grow pr-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight neon-heading-glow" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Vamos Pensar Juntos?
            </h2>
            <p className="text-xs sm:text-sm text-warm-brown/70">
                Programado com a cosmovisão de mundo de Amarasté
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-warm-brown/60 rounded-full p-2 transition-all hover:bg-warm-brown/10 hover:text-warm-brown z-20"
            aria-label="Close chat"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div
          ref={chatRef}
          onScroll={handleScroll}
          className="flex-1 p-4 overflow-y-auto space-y-4"
        >
          {messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1;
            const isStreaming = isLoading && msg.sender === 'assistant' && isLastMessage;

            return (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                {msg.sender === 'assistant' && (
                   <AssistantAvatar className="w-8 h-8 flex-shrink-0" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-warm-brown rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                    {isStreaming && msg.text === '' ? (
                      <div className="flex items-baseline gap-1.5 py-1">
                        <span className="font-normal text-warm-brown/80">Digitando</span>
                        <span className="w-1.5 h-1.5 bg-warm-brown/50 rounded-full dot-1"></span>
                        <span className="w-1.5 h-1.5 bg-warm-brown/50 rounded-full dot-2"></span>
                        <span className="w-1.5 h-1.5 bg-warm-brown/50 rounded-full dot-3"></span>
                      </div>
                    ) : (
                       <p className="font-normal">
                        {renderFormattedText(msg.text, !isStreaming)}
                        {isStreaming && (
                          <span className="inline-block w-2 h-4 bg-warm-brown ml-1 animate-pulse"></span>
                        )}
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
            <div className="px-4 pb-2">
                <p className="text-red-500 text-center text-sm">{error}</p>
            </div>
        )}

        <div className="p-4 border-t border-warm-brown/10">
          <form onSubmit={handleLocalSendMessage} className="flex items-center gap-2 relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isLoading ? '' : "Converse comigo..."}
              disabled={isLoading || !!error}
              className="flex-1 w-full bg-white/70 text-warm-brown placeholder-warm-brown/60 px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/80 transition"
              autoComplete="off"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-coke-red text-white rounded-md transition-colors blinking-stop-button"
                aria-label="Stop generation"
              >
                <RotatingCircleIcon />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!userInput.trim() || !!error}
                className="bg-primary text-white p-3 rounded-full transition-transform duration-200 enabled:hover:scale-110 enabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
