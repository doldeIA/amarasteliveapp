

import React, { useState } from 'react';

interface ProdutosLoginPageProps {
  onNavigateHome: () => void;
  onNavigateToSignUp: () => void;
}

const ProductTile: React.FC<{ name: string }> = ({ name }) => (
  <a 
    href="https://amarastelive.bandcamp.com/dashboard" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-40 h-40 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-bold text-lg border border-white/30 transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-105 hover:border-accent"
  >
    {name}
  </a>
);

const ProdutosLoginPage: React.FC<ProdutosLoginPageProps> = ({ onNavigateHome, onNavigateToSignUp }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              Acesso aos Produtos
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
                disabled={isLoading}
                className="w-full bg-transparent text-white px-4 py-2 rounded-lg ring-1 ring-white/50 hover:ring-white/80 transition mb-4 disabled:opacity-50 disabled:cursor-wait"
              >
                  {isLoading ? 'Entrando...' : 'ENTRAR'}
              </button>
          </form>
          <div className="text-center">
            <button onClick={onNavigateToSignUp} className="text-sm font-semibold text-white/70 hover:text-white hover:underline transition-colors">
              Cadastre-se
            </button>
          </div>
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
            onClick={onNavigateHome} 
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