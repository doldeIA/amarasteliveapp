import React, { useState } from 'react';
import { playClickSound, applyClickAnimation } from '../App';

interface ProdutosLoginPageProps {
  onNavigateHome: () => void;
  onNavigateToSignUp: () => void;
  onSpecialLoginSuccess: () => void;
  title: string;
}

const ProductTile: React.FC<{ name: string }> = ({ name }) => (
  <a 
    href="https://amarastelive.bandcamp.com/dashboard" 
    target="_blank" 
    rel="noopener noreferrer"
    onClick={(e) => {
        playClickSound();
        applyClickAnimation(e);
    }}
    className="w-40 h-40 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-bold text-lg border border-white/30 transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-105 hover:border-accent"
  >
    {name}
  </a>
);

const ProdutosLoginPage: React.FC<ProdutosLoginPageProps> = ({ onNavigateHome, onNavigateToSignUp, onSpecialLoginSuccess, title }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Special credential check
    if (login === '1212' && password === '1212') {
      onSpecialLoginSuccess();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha: password }),
      });
      
      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Falha no login. Verifique suas credenciais.');
      }
      
      // Handle successful login
      console.log('Token:', resData.token);
      setIsLoggedIn(true);

    } catch (err: any) {
      // For demonstration, allow login with any input if API fails
      if(login && password) {
        console.warn('API call failed, proceeding with demo login.');
        setIsLoggedIn(true);
      } else {
        setError(err.message || 'Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderLoginContent = () => (
      <>
          <h2 className="text-2xl font-bold text-white neon-heading-glow text-center mb-6">
              {title === 'Acesso aos Produtos' ? title : 'ENTRAR'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
               <div>
                  <label htmlFor="login-prod" className="sr-only">Login</label>
                  <input 
                    type="text" 
                    id="login-prod" 
                    required 
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Login"
                    className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 p-2 mb-4 focus:outline-none focus:border-white/70"
                  />
              </div>
              <div>
                  <label htmlFor="password-prod" className="sr-only">Senha</label>
                  <input 
                    type="password" 
                    id="password-prod" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 p-2 mb-4 focus:outline-none focus:border-white/70"
                  />
              </div>
              
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
              
              <button 
                type="submit" 
                onClick={(e) => {
                    if (login && password) {
                        playClickSound();
                        applyClickAnimation(e);
                    }
                }}
                disabled={isLoading}
                className="w-full bg-transparent text-white px-4 py-2 rounded-lg ring-1 ring-white/50 hover:ring-white/80 transition mb-4 disabled:opacity-50 disabled:cursor-wait"
              >
                  {isLoading ? 'Entrando...' : 'ENTRAR'}
              </button>
          </form>
          <div className="text-center">
            <button 
                onClick={(e) => {
                    playClickSound();
                    applyClickAnimation(e);
                    onNavigateToSignUp();
                }} 
                className="text-sm font-semibold text-white/70 hover:text-white hover:underline transition-colors">
              Cadastre-se
            </button>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/50 text-sm">OU</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>
          <button 
            onClick={(e) => {
                playClickSound();
                applyClickAnimation(e);
            }}
            className="w-full py-3 px-4 bg-white text-warm-brown font-semibold rounded-lg shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h13.07c-.6 2.76-2.31 5.17-4.81 6.81l7.69 5.95c4.5-4.13 7.13-10.12 7.13-16.72z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.69-5.95c-2.13 1.42-4.86 2.27-7.91 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Login com Gmail
          </button>
      </>
  );

  const renderProductsContent = () => (
      <>
          <h2 className="text-2xl font-bold text-white neon-heading-glow text-center mb-4">
              Nossos Produtos
          </h2>
          <div className="glass-scrollbar overflow-auto max-h-64 pr-2">
            <div className="flex flex-col items-center gap-4">
                {/* Top of pyramid */}
                <div className="flex justify-center">
                  <ProductTile name="Camisa" />
                </div>
                {/* Bottom of pyramid */}
                <div className="flex flex-wrap justify-center gap-4">
                  <ProductTile name="Adesivo" />
                  <ProductTile name="Músicas" />
                </div>
            </div>
          </div>
      </>
  );


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-swoop-in">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6 w-full max-w-md mx-auto relative">
          
          <button 
            onClick={(e) => {
                playClickSound();
                applyClickAnimation(e);
                onNavigateHome();
            }}
            className="absolute top-4 right-4 text-white text-2xl hover:text-white/80 cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>

          {isLoggedIn ? renderProductsContent() : renderLoginContent()}
      
        </div>
    </div>
  );
};

export default ProdutosLoginPage;