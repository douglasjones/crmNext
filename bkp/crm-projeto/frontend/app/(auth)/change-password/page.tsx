'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import AlertDialog, { AlertDialogType } from '@/components/ui/AlertDialog'; // Importando o novo componente

// Reutilizando os estilos da página de login para consistência visual
const ChangePasswordStyles = () => (
  <style>{`
    .main-container { display: flex; min-height: 100vh; font-family: sans-serif; background-color: #f3f4f6; align-items: center; justify-content: center; }
    .logo-image { max-width: 220px; height: auto; margin-bottom: 40px; }
    .change-password-box { background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 450px; text-align: center; }
    .title { font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 16px; color: #111827; }
    .subtitle { font-size: 16px; color: #4b5563; text-align: center; margin-bottom: 32px; }
    .form { display: flex; flex-direction: column; }
    .input-group { display: flex; flex-direction: column; gap: 20px; }
    .form-field { display: flex; flex-direction: column; text-align: left; }
    .label { margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151; }
    .input { padding: 12px; border-radius: 4px; border: 1px solid #d1d5db; font-size: 16px; }
    .button { padding: 12px; border-radius: 4px; border: none; background-color: #2A79C8; color: white; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 16px; }
  `}</style>
);

// Estado para o nosso novo AlertDialog
interface AlertConfig {
  isOpen: boolean;
  type: AlertDialogType;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPk, setUserPk] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertConfig>({ isOpen: false, type: 'info', message: '', onClose: () => {} });

  const closeAlert = () => setAlert((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserPk = localStorage.getItem('user_pk');
      if (storedUserPk) {
        setUserPk(parseInt(storedUserPk, 10));
      } else {
        setAlert({
          isOpen: true,
          type: 'error',
          title: 'Sessão Inválida',
          message: 'Sua sessão é inválida ou expirou. Por favor, faça login novamente.',
          onClose: () => {
            closeAlert();
            router.push('/login');
          },
        });
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userPk) {
      setAlert({ isOpen: true, type: 'error', title: 'Erro', message: 'ID do usuário não encontrado. Faça login novamente.', onClose: closeAlert });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ isOpen: true, type: 'warning', title: 'Atenção', message: 'As senhas não conferem.', onClose: closeAlert });
      return;
    }
    if (password.length < 6) {
      setAlert({ isOpen: true, type: 'warning', title: 'Atenção', message: 'A senha deve ter no mínimo 6 caracteres.', onClose: closeAlert });
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(userPk, password);

      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Sucesso!',
        message: 'Senha alterada com sucesso! Você será redirecionado para a tela de login.',
        onClose: () => {
          closeAlert();
          localStorage.removeItem('user_pk');
          localStorage.removeItem('authToken');
          router.push('/login');
        },
      });

    } catch (err: any) {
      setAlert({ isOpen: true, type: 'error', title: 'Erro ao Salvar', message: err.message || 'Ocorreu um erro ao alterar a senha.', onClose: closeAlert });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ChangePasswordStyles />
      <AlertDialog 
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={alert.onClose}
      />
      <div className="main-container">
        <div className="change-password-box">
          <img src="https://server.gpros.com.br/comercial/logos/logo_base.png" alt="GPROS Logo" className="logo-image" />
          <h1 className="title">Crie sua nova senha</h1>
          <p className="subtitle">Para sua segurança, sua senha temporária precisa ser alterada.</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-field">
                <label htmlFor="password" className="label">Nova Senha</label>
                <input type="password" id="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="confirmPassword" className="label">Confirme a Nova Senha</label>
                <input type="password" id="confirmPassword" required className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
