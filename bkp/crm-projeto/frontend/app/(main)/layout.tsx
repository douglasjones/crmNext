'use client';

import packageJson from '../../package.json';
import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import styles from './MainLayout.module.css';
import { useLayout } from '@/hooks/useLayout'; // Importando useLayout

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarCollapsed } = useLayout(); // Usando o hook para pegar o estado do sidebar

  return (
    <div className={styles.container}>
      <Sidebar version={packageJson.version} />
      <main className={`${styles.content} ${isSidebarCollapsed ? styles.contentCollapsed : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;