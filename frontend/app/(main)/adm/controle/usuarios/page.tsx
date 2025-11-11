'use client';

import React, { useState, useEffect } from 'react';
import { userService, User } from '@/services/userService';
import styles from './UsuariosPage.module.css'; // Criaremos este arquivo de estilo

const UsuariosPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Falha ao carregar usuários.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Controle de Usuários</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Login</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.pk}>
                  <td>{user.pk}</td>
                  <td>{user.ds_usuario}</td>
                  <td>{user.ds_login}</td>
                  <td>
                    <span className={`${styles.status} ${user.ic_status === 1 ? styles.active : styles.inactive}`}>
                      {user.ic_status === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.actionButton}>Editar</button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`}>Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosPage;