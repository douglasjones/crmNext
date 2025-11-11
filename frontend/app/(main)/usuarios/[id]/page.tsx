'use client';

import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { userService, UserPayload } from '@/services/userService';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// Estilos (sem alteração)
const FormStyles = () => (
  <style>{`
    .page-container {
      padding: 2rem;
      background-color: #f9fafb;
    }
    .title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 2rem;
    }
    .form-container {
      background-color: white;
      padding: 2.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      max-width: 700px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 640px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    .label {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }
    .input, .select {
      padding: 0.75rem;
      border-radius: 0.375rem;
      border: 1px solid #d1d5db;
      font-size: 1rem;
      width: 100%;
    }
    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;
    }
    .btn-primary:hover {
      background-color: #1d4ed8;
    }
    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }
    .btn-secondary:hover {
      background-color: #d1d5db;
    }
  `}</style>
);

export default function UsuarioFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const isEditMode = id !== 'novo';
  const [formData, setFormData] = useState<UserPayload>({
    ds_usuario: '',
    ds_login: '',
    ds_senha: '',
    ds_cel: '',
    ic_status: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchUser = useCallback(async (userId: number) => {
    try {
      const userData = await userService.getUserById(userId);
      setFormData({ ...userData, ds_senha: '' }); // Limpa a senha por segurança
    } catch (error) {
      alert('Erro ao buscar dados do usuário.');
      router.push('/usuarios');
    } finally {
      setIsFetching(false);
    }
  }, [router]);

  useEffect(() => {
    if (isEditMode) {
      const userId = parseInt(id, 10);
      if (!isNaN(userId)) {
        fetchUser(userId);
      }
    } else {
      setIsFetching(false);
    }
  }, [id, isEditMode, fetchUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'ic_status' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Remove a senha do payload se estiver vazia no modo de edição
    const payload = { ...formData };
    if (isEditMode && !payload.ds_senha) {
      delete payload.ds_senha;
    }

    try {
      if (isEditMode) {
        await userService.updateUser(parseInt(id, 10), payload);
      } else {
        await userService.createUser(payload);
      }
      alert(`Usuário ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
      router.push('/usuarios');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Ocorreu um erro ao salvar o usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <FormStyles />
      <div className="page-container">
        <h1 className="title">{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="ds_usuario" className="label">Nome do Usuário</label>
                <input type="text" name="ds_usuario" id="ds_usuario" className="input" value={formData.ds_usuario} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="ds_login" className="label">Login</label>
                <input type="text" name="ds_login" id="ds_login" className="input" value={formData.ds_login} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="ds_senha" className="label">Senha</label>
                <input type="password" name="ds_senha" id="ds_senha" className="input" value={formData.ds_senha || ''} onChange={handleChange} placeholder={isEditMode ? 'Deixe em branco para não alterar' : ''} required={!isEditMode} />
              </div>

              <div className="form-group">
                <label htmlFor="ds_cel" className="label">Celular</label>
                <input type="text" name="ds_cel" id="ds_cel" className="input" value={formData.ds_cel || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="ic_status" className="label">Status</label>
                <select name="ic_status" id="ic_status" className="select" value={formData.ic_status} onChange={handleChange}>
                  <option value="1">Ativo</option>
                  <option value="0">Inativo</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => router.push('/usuarios')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
