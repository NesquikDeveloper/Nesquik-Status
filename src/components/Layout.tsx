import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  
  // Fecha o menu móvel quando a rota muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-dark text-text-primary">
      {/* Header */}
      <header className="bg-panel-dark border-b border-border-dark">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-neon-blue" />
            <h1 className="text-xl font-bold">Hype MC</h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-card-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/status')}
              className={`px-4 py-2 rounded-md transition-all ${
                isActive('/status') 
                  ? 'bg-card-dark text-neon-blue' 
                  : 'hover:bg-card-dark hover:text-neon-blue'
              }`}
            >
              Status
            </button>
            
            <button 
              onClick={() => navigate('/updates')}
              className={`px-4 py-2 rounded-md transition-all ${
                isActive('/updates') 
                  ? 'bg-card-dark text-neon-blue' 
                  : 'hover:bg-card-dark hover:text-neon-blue'
              }`}
            >
              Updates
            </button>
            
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-card-dark text-neon-green' 
                      : 'hover:bg-card-dark hover:text-neon-green'
                  }`}
                >
                  Dashboard
                </button>
                
                <button 
                  onClick={() => navigate('/admin')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    isActive('/admin') 
                      ? 'bg-card-dark text-neon-purple' 
                      : 'hover:bg-card-dark hover:text-neon-purple'
                  }`}
                >
                  Admin
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-neon-red hover:bg-card-dark transition-all"
                >
                  Sair
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <button 
                onClick={() => navigate('/login')}
                className="neon-btn-blue px-4 py-2"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-panel-dark border-b border-border-dark">
          <nav className="flex flex-col gap-2 p-4">
            <button 
              onClick={() => navigate('/status')}
              className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all ${
                isActive('/status') 
                  ? 'bg-card-dark text-neon-blue' 
                  : 'hover:bg-card-dark hover:text-neon-blue'
              }`}
            >
              <Activity className="h-5 w-5" />
              <span>Status</span>
            </button>
            
            <button 
              onClick={() => navigate('/updates')}
              className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all ${
                isActive('/updates') 
                  ? 'bg-card-dark text-neon-blue' 
                  : 'hover:bg-card-dark hover:text-neon-blue'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span>Updates</span>
            </button>
            
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-card-dark text-neon-green' 
                      : 'hover:bg-card-dark hover:text-neon-green'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                
                <button 
                  onClick={() => navigate('/admin')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all ${
                    isActive('/admin') 
                      ? 'bg-card-dark text-neon-purple' 
                      : 'hover:bg-card-dark hover:text-neon-purple'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Admin</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-md text-neon-red hover:bg-card-dark transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <button 
                onClick={() => navigate('/login')}
                className="neon-btn-blue flex items-center justify-center gap-2 px-4 py-3"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border-dark py-4">
        <div className="container mx-auto px-4 text-center text-text-secondary text-sm">
          <p>© 2025 Hype MC. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
