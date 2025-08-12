import React from 'react';
import ChatIcon from './icons/ChatIcon';

interface ChatWidgetProps {
  onOpen: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-20 bg-white/50 backdrop-blur-sm text-primary p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-100 chat-pulse-glow"
      aria-label="Open chat"
    >
      <ChatIcon className="w-8 h-8" />
    </button>
  );
};

export default ChatWidget;