import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types';

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setUser(data.data.user);
      setIsLoading(false);
      return data.data.user;
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
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
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