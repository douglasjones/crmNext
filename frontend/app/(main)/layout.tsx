'use client';

import packageJson from '../../package.json';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import styles from './MainLayout.module.css';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/hooks/useAuth';
import AlertDialog from '@/components/ui/AlertDialog';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarCollapsed } = useLayout();
  const { isIdleWarningVisible, handleContinueSession } = useAuth();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isIdleWarningVisible) {
      setCountdown(60); // Reinicia a contagem
      // Inicia o contador regressivo
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isIdleWarningVisible]);

  return (
    <div className={styles.container}>
      <Sidebar version={packageJson.version} />
      <main className={`${styles.content} ${isSidebarCollapsed ? styles.contentCollapsed : ''}`}>
        {children}
      </main>

      {isIdleWarningVisible && (
        <AlertDialog
          type="warning"
          title="Você ainda está aí?"
          message={`Sua sessão será encerrada por inatividade em ${countdown} segundos. Deseja continuar?`}
          onConfirm={handleContinueSession}
          confirmText="Continuar Logado"
        />
      )}
    </div>
  );
};

export default MainLayout;
