
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (user: string, pass: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
      setIsLoading(false);
    }
    // On success, the parent will close the modal
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-swoop-in"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-sm bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Fechar login de administrador"
        >
          <CloseIcon className="w-7 h-7" />
        </button>

        <h2 className="text-center text-2xl font-bold text-white neon-heading-glow mb-8">
          Acesso Administrador
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-user" className="sr-only">Usuário</label>
            <input
              type="text"
              id="admin-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              required
              className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="sr-only">Senha</label>
            <input
              type="password"
              id="admin-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"
            />
          </div>
          
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 px-4 bg-transparent text-white font-bold rounded-lg ring-1 ring-white/50 hover:ring-white/80 transition disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? 'Verificando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
