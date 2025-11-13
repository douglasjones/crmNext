'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { userService, User } from '@/services/userService';
import { usePathname } from 'next/navigation'; // Import usePathname
import LoadingOverlay from '@/components/ui/LoadingOverlay'; // Import LoadingOverlay

// Estilos CSS-in-JS (sem alteração)
const PageStyles = () => (
  <style>{`
    .page-container {
      padding: 2rem;
      background-color: #f9fafb;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }
    .btn-primary:hover {
      background-color: #1d4ed8;
    }
    .table-container {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 1rem 1.5rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background-color: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    .status-active {
      color: #059669;
      font-weight: 600;
    }
    .status-inactive {
      color: #d97706;
      font-weight: 600;
    }
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }
    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }
    .btn-secondary:hover {
      background-color: #d1d5db;
    }
    .btn-danger {
      background-color: #ef4444;
      color: white;
    }
    .btn-danger:hover {
      background-color: #dc2626;
    }
  `}</style>
);

export default function UsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // Get current pathname

  // Simple mapping for breadcrumb display names
  const breadcrumbMap: { [key: string]: string } = {
    'adm': 'ADM',
    'controle': 'Controle',
    'usuarios': 'Usuários',
    // Add other mappings as needed
  };

  // Explicit breadcrumbs for specific routes
  const routeBreadcrumbs: { [key: string]: string[] } = {
    '/usuarios': ['ADM', 'Usuários'],
    // Add other specific routes if needed
  };

  // Generate breadcrumb dynamically
  const generateBreadcrumb = () => {
    if (routeBreadcrumbs[pathname]) {
      return routeBreadcrumbs[pathname].join(' > ');
    }

    const segments = pathname.split('/').filter(segment => segment !== '' && segment !== '(main)');
    const breadcrumbItems = segments.map((segment) => {
      return breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    });
    return breadcrumbItems.join(' > ');
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
      // Adicionar feedback de erro para o usuário aqui, se necessário
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleNewUser = () => {
    router.push('/usuarios/novo');
  };

  const handleEditUser = (id: number) => {
    router.push(`/usuarios/${id}`);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(id);
        // Atualiza a lista removendo o usuário excluído
        setUsers(prevUsers => prevUsers.filter(user => user.pk !== id));
      } catch (error) {
        console.error("Erro ao excluir usuário", error);
        alert('Não foi possível excluir o usuário.');
      }
    }
  };

  return (
    <>
      <PageStyles />
      <div className="page-container">
        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <>
            <div style={{ color: '#888', fontSize: '0.9em', marginBottom: '10px' }}>{generateBreadcrumb()}</div>
            <div className="header">
              <h1 className="title">Usuários</h1>
              <button onClick={handleNewUser} className="btn-primary">
                Novo Usuário
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Login</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.pk}>
                      <td>{user.ds_usuario}</td>
                      <td>{user.ds_login}</td>
                      <td>
                        <span className={user.ic_status === 1 ? 'status-active' : 'status-inactive'}>
                          {user.ic_status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => handleEditUser(user.pk)} className="btn-secondary">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteUser(user.pk)} className="btn btn-danger">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
