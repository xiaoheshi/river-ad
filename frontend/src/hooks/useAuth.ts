import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthRequest, RegisterRequest, AuthResponse } from '@/types';
import apiService from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: AuthRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: AuthRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await apiService.login(credentials);
          
          // Store token in localStorage for API interceptor
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.token);
          }
          
          // Create user object from response
          const user: User = {
            id: response.userId,
            email: response.email,
            firstName: response.fullName?.split(' ')[0] || '',
            lastName: response.fullName?.split(' ').slice(1).join(' ') || '',
            preferredLanguage: 'en',
            preferredCurrency: 'USD',
            timezone: 'UTC',
            isActive: true,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.message || '登录失败，请重试',
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await apiService.register(userData);
          
          // Store token in localStorage for API interceptor
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.token);
          }
          
          // Create user object from response
          const user: User = {
            id: response.userId,
            email: response.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            preferredLanguage: userData.preferredLanguage || 'en',
            preferredCurrency: 'USD',
            timezone: 'UTC',
            isActive: true,
            emailVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.message || '注册失败，请重试',
          });
          throw error;
        }
      },

      logout: () => {
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook for easier usage
export const useAuth = () => {
  const store = useAuthStore();
  return store;
};