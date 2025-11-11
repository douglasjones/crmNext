'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { moduleService, ModuleItem } from '@/services/moduleService';
import styles from './Sidebar.module.css';

// Ícones SVG (mantidos para mapeamento)
const icons: { [key: string]: React.ReactNode } = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>,
  oportunidades: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 3.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m0 0h.375c.621 0 1.125.504 1.125 1.125v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 01-.75-.75v-.75m0 0h.375c.621 0 1.125.504 1.125 1.125v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 01-.75-.75v-.75M3 12h18" /></svg>,
  clientes: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-9 0a4.5 4.5 0 109 0m-9 0a4.5 4.5 0 11-9 0" /></svg>,
  financeiro: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" /></svg>,
  rh: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M15 12.75h.007v.008H15v-.008z" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>,
  arrowLeft: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>,
};

// Interface para o item de menu formatado para o frontend
export interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

// Função para mapear o nome do módulo para um ícone
const getIconByModuleName = (moduleName: string): React.ReactNode => {
  const name = moduleName.toLowerCase();
  if (name.includes('dashboard')) return icons.dashboard;
  if (name.includes('oportunidades')) return icons.oportunidades;
  if (name.includes('clientes')) return icons.clientes;
  if (name.includes('financeiro') || name.includes('contas')) return icons.financeiro;
  if (name.includes('rh') || name.includes('colaboradores')) return icons.rh;
  return icons.dashboard; // Ícone padrão
};

const Sidebar = ({ version }: { version: string }) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isSidebarCollapsed, toggleSidebar } = useLayout();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchAndFormatModules = async () => {
      try {
        const fetchedModules = await moduleService.getModules();
        
        const formattedMenuItems = fetchedModules
          .filter(module => module.ic_menu === 1) // Apenas módulos que devem aparecer no menu
          .sort((a, b) => (a.nr_ordem_menu || 99) - (b.nr_ordem_menu || 99)) // Ordena pelo número de ordem
          .map((module: ModuleItem): MenuItem => ({
            path: module.ds_dominio,
            name: module.ds_modulo,
            icon: getIconByModuleName(module.ds_modulo),
          }));

        setMenuItems(formattedMenuItems);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
        // Opcional: definir um menu de fallback em caso de erro
        setMenuItems([]); 
      }
    };

    fetchAndFormatModules();
  }, []);

  return (
    <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Botão de Toggle */}
      <button onClick={toggleSidebar} className={`${styles.toggleButton} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        {icons.arrowLeft}
      </button>

      {/* Seção Superior: Empresa e Usuário */}
      <div className={styles.companySection}>
        <div className={styles.companyId}>
          <div className={styles.companyIcon}>G</div>
          <div className={styles.companyInfo}>
            <span className={styles.companyName}>Nome da Empresa Lead</span>
            <span className={styles.userName}>Douglas Jones</span>
          </div>
        </div>
        <button className={styles.logoutButton} title="Sair" onClick={logout}>
          {icons.logout}
          <span>Sair</span>
        </button>
      </div>

      {/* Seção do Meio: Navegação */}
      <nav className={styles.nav}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className={`${styles.navLink} ${pathname.startsWith(item.path) ? styles.active : ''}`}>
                <span className={styles.icon}>{item.icon}</span>
                {!isSidebarCollapsed && <span className={styles.name}>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Seção Inferior: Logo */}
      <div className={styles.footer}>
        <div className={styles.logoContainer}>
          <img src="https://server.gpros.com.br/comercial/logos/logo_base.png" alt="GPROS Logo" />
          <p style={{ color: 'white', fontSize: '12px', marginTop: '5px' }}>v{version}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;