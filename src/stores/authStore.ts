import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
}

// Credenciais hardcoded conforme solicitado
const ADMIN_USERNAME = 'HypeMC';
const ADMIN_PASSWORD = 'HypeMCZINH01231!';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (username: string, password: string) => {
        // Verifica se as credenciais correspondem ao usuário admin
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          set({ 
            user: { 
              username: ADMIN_USERNAME, 
              isAdmin: true 
            }, 
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      checkAuth: () => {
        // A persistência é gerenciada pelo middleware persist
        // Esta função é mantida para compatibilidade e possíveis verificações futuras
        const state = get();
        if (state.user && !state.isAuthenticated) {
          set({ isAuthenticated: true });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
