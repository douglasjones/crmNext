'use client';

import { createContext, useState, ReactNode, useContext } from 'react';

interface LayoutContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const value = {
    isSidebarCollapsed,
    toggleSidebar,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
