
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    whatsapp: '',
    login: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.name,
          instagram: formData.instagram,
          whatsapp: formData.whatsapp,
          login: formData.login,
          senha: formData.password
        })
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Falha no cadastro. Tente novamente.');
      }
      alert('Cadastro realizado com sucesso!');
      onSwitchToLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-swoop-in" 
      onClick={onClose}
    >
      <div 
        className="relative w-[90%] max-w-md bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6 text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close sign up form"
        >
          <CloseIcon className="w-7 h-7" />
        </button>

        <h2 
          className="text-center text-[2rem] font-bold text-white neon-heading-glow mb-6 flex-shrink-0"
        >
          CRIE SUA CONTA
        </h2>
        
        <div className="overflow-y-auto max-h-[calc(80vh-150px)] pr-4 custom-scrollbar">
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Nome</label>
                <input type="text" id="name" required value={formData.name} onChange={handleInputChange} className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"/>
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-white/80 mb-1">@Instagram</label>
                <input type="text" id="instagram" required value={formData.instagram} onChange={handleInputChange} className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"/>
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-white/80 mb-1">WhatsApp</label>
                <input type="tel" id="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"/>
              </div>
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-white/80 mb-1">Login</label>
                <input type="text" id="login" required value={formData.login} onChange={handleInputChange} className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"/>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Senha</label>
                <input type="password" id="password" required value={formData.password} onChange={handleInputChange} className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"/>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">Confirmar Senha</label>
                <input type="password" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full bg-transparent border-0 border-b border-white/40 p-2 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-white transition"/>
              </div>

              {error && <p className="text-red-400 text-center text-sm pt-2">{error}</p>}

              <button type="submit" disabled={isLoading} className="w-full mt-6 py-3 px-4 bg-soft-beige text-primary font-bold rounded-lg shadow-lg transition-transform hover:scale-105 soft-neon disabled:opacity-50 disabled:cursor-wait">
                {isLoading ? 'CADASTRANDO...' : 'CADASTRAR'}
              </button>
            </form>
            
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink mx-4 text-white/50 text-sm">OU</span>
                <div className="flex-grow border-t border-white/20"></div>
            </div>

            <button className="w-full py-3 px-4 bg-white text-warm-brown font-semibold rounded-lg shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h13.07c-.6 2.76-2.31 5.17-4.81 6.81l7.69 5.95c4.5-4.13 7.13-10.12 7.13-16.72z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.69-5.95c-2.13 1.42-4.86 2.27-7.91 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Entrar com o Gmail
            </button>
            <div className="text-center pt-5">
              <button onClick={onSwitchToLogin} className="text-sm font-semibold text-white/70 hover:text-white hover:underline transition-colors">
                Já tem login? Faça Login
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;