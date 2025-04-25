import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    // Simular um pequeno delay para dar feedback visual
    setTimeout(() => {
      const isSuccess = login(username, password);
      
      if (isSuccess) {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        setError('Usuário ou senha incorretos. Este sistema é restrito à equipe administrativa.');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <div className="min-h-screen bg-base-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex p-3 rounded-full bg-panel-dark border border-border-dark mb-4">
            <Activity className="h-8 w-8 text-neon-blue" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Hype MC</h1>
          <p className="text-text-secondary">Acesso administrativo ao painel de status</p>
        </div>
        
        <div className="bg-card-dark border border-border-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Login</h2>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-3 bg-neon-red/10 border border-neon-red rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-neon-red shrink-0 mt-0.5" />
                <p className="text-sm text-neon-red">{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-dark w-full pl-10"
                  placeholder="Digite seu usuário"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark w-full pl-10"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full neon-btn-blue flex items-center justify-center py-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-text-secondary">
            <p>Acesso restrito à equipe administrativa</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/status')}
            className="text-text-secondary hover:text-neon-blue transition-all"
          >
            Voltar para Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;