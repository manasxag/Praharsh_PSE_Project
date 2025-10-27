import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('eventr_auth');
    if (storedAuth) {
      try {
        const { user } = JSON.parse(storedAuth);
        setUser(user);
      } catch (err) {
        console.error('Failed to parse stored auth data', err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.login(email, password);
      
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      
      const userData = response.data as User;
      setUser(userData);
      
      // Store user data in localStorage
      localStorage.setItem('eventr_auth', JSON.stringify({ user: userData }));
      
      setIsLoading(false);
      return userData;
    } catch (err) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Remove user data from localStorage
      localStorage.removeItem('eventr_auth');
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}