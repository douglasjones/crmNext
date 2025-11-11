'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';
import { moduleService, ModuleItem as ApiModuleItem } from '@/services/moduleService';
import styles from './Sidebar.module.css';

// Import all major icon libraries
import * as HeroIcons from '@heroicons/react/24/outline';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as MdIcons from 'react-icons/md';
import * as PiIcons from 'react-icons/pi';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as VscIcons from 'react-icons/vsc';
import * as TbIcons from 'react-icons/tb';


// Destructure common icons for ease of use and default values
const { HomeIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightOnRectangleIcon } = HeroIcons;

interface SidebarProps {
  version: string;
}

interface MenuItem {
  pk: number;
  name: string;
  href: string;
  icon: React.ElementType;
  modulo_pai_pk: number | null;
  children?: MenuItem[];
}

// Combine all icon libraries into a single lookup object
const ALL_ICON_LIBRARIES = {
  hero: HeroIcons as any,
  fa: FaIcons as any,
  fa6: Fa6Icons as any,
  md: MdIcons as any,
  pi: PiIcons as any,
  gi: GiIcons as any,
  go: GoIcons as any,
  gr: GrIcons as any,
  vsc: VscIcons as any,
  tb: TbIcons as any,
};

// Function to dynamically get the icon component based on a string identifier
const getIconComponent = (iconIdentifier?: string | null): React.ElementType => {
  if (!iconIdentifier) {
    return HomeIcon; // Default icon if none is provided
  }

  const parts = iconIdentifier.split(':');
  const prefix = parts.length > 1 ? parts[0] : 'hero'; // Default to 'hero' if no prefix
  const iconName = parts.length > 1 ? parts[1] : parts[0];

  const library = ALL_ICON_LIBRARIES[prefix as keyof typeof ALL_ICON_LIBRARIES];

  if (library && typeof library === 'object' && iconName in library) {
    const IconComponent = library[iconName];
    if (typeof IconComponent === 'function') {
        return IconComponent;
    }
  }

  return HomeIcon; // Fallback for invalid icon names or prefixes
};


const Sidebar = ({ version }: SidebarProps) => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openSubmenus, setOpenSubmenus] = useState<Set<number>>(new Set());

  const toggleSubmenu = useCallback((pk: number) => {
    setOpenSubmenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pk)) {
        newSet.delete(pk);
      } else {
        newSet.add(pk);
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules: ApiModuleItem[] = await moduleService.getModules();
        const allMenuItems: MenuItem[] = fetchedModules
          .filter(module => module.ic_menu === 1)
          .sort((a, b) => (a.nr_ordem_menu ?? 0) - (b.nr_ordem_menu ?? 0))
          .map(module => ({
            pk: module.pk,
            name: module.ds_modulo,
            href: module.ds_dominio,
            icon: getIconComponent(module.ds_icone),
            modulo_pai_pk: module.modulo_pai_pk,
          }));

        const buildHierarchy = (items: MenuItem[]) => {
          const topLevelItems: MenuItem[] = [];
          const childrenOf: { [key: number]: MenuItem[] } = {};
          items.forEach(item => {
            if (item.modulo_pai_pk === null) {
              topLevelItems.push(item);
            } else {
              if (!childrenOf[item.modulo_pai_pk]) {
                childrenOf[item.modulo_pai_pk] = [];
              }
              childrenOf[item.modulo_pai_pk].push(item);
            }
          });
          topLevelItems.forEach(item => {
            if (childrenOf[item.pk]) {
              item.children = childrenOf[item.pk];
            }
          });
          return topLevelItems;
        };

        setMenuItems(buildHierarchy(allMenuItems));
      } catch (err) {
        console.error('Failed to fetch modules:', err);
      }
    };
    fetchModules();
  }, []);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSubmenus.has(item.pk);

    return (
      <li key={item.pk}>
        <div className={`${styles.navLinkContainer} ${isActive ? styles.active : ''}`}>
          <Link
              href={item.href}
              className={styles.navLink}
              onClick={hasChildren ? (e) => { e.preventDefault(); toggleSubmenu(item.pk); } : undefined}
            >
            <item.icon className={styles.icon} />
            <span className={styles.name}>{item.name}</span>
          </Link>
          {hasChildren && !isSidebarCollapsed && (
            <button onClick={() => toggleSubmenu(item.pk)} className={`${styles.submenuToggle} ${isOpen ? styles.submenuToggleOpen : ''}`}>
              {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          )}
        </div>
        {hasChildren && isOpen && !isSidebarCollapsed && (
          <ul className={styles.submenu}>
            {item.children?.map(child => renderMenuItem(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <button onClick={toggleSidebar} className={`${styles.toggleButton} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      {/* Seção Superior: Usuário (Layout corrigido para mostrar dados do usuário) */}
      <div className={styles.companySection}>
        <div className={styles.companyId}>
          <div className={styles.companyIcon}>
            {user ? user.ds_usuario.charAt(0).toUpperCase() : '?'}
          </div>
          <div className={styles.companyInfo}>
            <span className={styles.companyName}>{user?.ds_usuario}</span>
            {/* A segunda linha pode ser usada para um email ou perfil no futuro */}
          </div>
        </div>
        <button className={styles.logoutButton} title="Sair" onClick={logout}>
          <ArrowRightOnRectangleIcon />
          <span>Sair</span>
        </button>
      </div>

      {/* Seção do Meio: Navegação */}
      <nav className={styles.nav}>
        <ul>
          {menuItems.map(item => renderMenuItem(item))}
        </ul>
      </nav>

      {/* Seção Inferior: Logo e Versão (Layout do Backup) */}
      <div className={styles.footer}>
        <div className={styles.logoContainer}>
          <img src="https://server.gpros.com.br/comercial/logos/logo_base.png" alt="GPROS Logo" />
        </div>
        <span className={styles.version}>v{version}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
