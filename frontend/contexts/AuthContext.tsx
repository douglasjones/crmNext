'use client';

import { createContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

// --- Configurações de Timeout ---
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; 
const WARNING_DURATION_MS = 1 * 60 * 1000; 

// Adicionando a interface do Usuário
interface User {
  pk: number;
  ds_usuario: string;
  // Outros campos do usuário podem ser adicionados aqui
}

interface AuthContextType {
  isAuthenticated: boolean;
  isIdleWarningVisible: boolean;
  user: User | null; // Adicionado
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  handleContinueSession: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isIdleWarningVisible, setIsIdleWarningVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Adicionado
  const router = useRouter();

  const idleTimer = useRef<NodeJS.Timeout>();
  const warningTimer = useRef<NodeJS.Timeout>();

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Alterado de 'user_pk' para 'user'
    setIsAuthenticated(false);
    setUser(null); // Limpa o estado do usuário
    
    clearTimers();
    setIsIdleWarningVisible(false);
    
    router.push('/login');
  }, [router]);

  const startTimers = useCallback(() => {
    warningTimer.current = setTimeout(() => {
      setIsIdleWarningVisible(true);
    }, IDLE_TIMEOUT_MS - WARNING_DURATION_MS);

    idleTimer.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT_MS);
  }, [logout]);

  const clearTimers = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  };

  const resetTimers = useCallback(() => {
    clearTimers();
    startTimers();
  }, [startTimers]);

  const handleContinueSession = () => {
    setIsIdleWarningVisible(false);
    resetTimers();
  };

  const login = async (credentials: any) => {
    const response = await authService.login(credentials);
    if (response && response.token) {
      localStorage.setItem('authToken', response.token);
      // Armazena o objeto do usuário inteiro
      localStorage.setItem('user', JSON.stringify(response.user)); 
      setIsAuthenticated(true);
      setUser(response.user); // Define o estado do usuário
      resetTimers();
    }
    return response;
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        resetTimers();
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        logout(); // Limpa se os dados estiverem corrompidos
      }
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    
    const eventListener = () => {
      if (isAuthenticated) {
        resetTimers();
      }
    };

    events.forEach(event => window.addEventListener(event, eventListener));

    return () => {
      events.forEach(event => window.removeEventListener(event, eventListener));
      clearTimers();
    };
  }, [isAuthenticated, resetTimers, logout]);


  const value = {
    isAuthenticated,
    isIdleWarningVisible,
    user, // Adicionado
    login,
    logout,
    handleContinueSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};