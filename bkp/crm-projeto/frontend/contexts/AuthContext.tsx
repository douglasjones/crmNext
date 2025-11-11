'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

interface AuthContextType {
  // No futuro: user, token, etc.
  login: (credentials: any) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const login = async (credentials: any) => {
    const response = await authService.login(credentials);
    // Lógica futura: armazenar token e dados do usuário no estado
    return response;
  };

  const logout = () => {
    // Limpa os dados de autenticação
    localStorage.removeItem('user_pk');
    localStorage.removeItem('authToken');
    
    // Redireciona para a página de login
    router.push('/login');
  };

  const value = {
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
