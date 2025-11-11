'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface Company {
  pk: number;
  name: string;
  cnpj: string;
}

interface CompanyContextType {
  company: Company | null;
  setCompany: (company: Company | null) => void;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
  // Para demonstração, estamos usando um valor estático.
  // No futuro, isso pode ser carregado de uma API.
  const [company, setCompany] = useState<Company | null>({
    pk: 1,
    name: 'GPROS',
    cnpj: '12.345.678/0001-99',
  });

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
