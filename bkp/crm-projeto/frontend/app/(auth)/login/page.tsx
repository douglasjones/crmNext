'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AlertDialog, { AlertDialogType } from '@/components/ui/AlertDialog'; // Importando o novo componente

// Estilos (sem alterações)
const ResponsiveStyles = () => (
  <style>{`
    .main-container { display: flex; min-height: 100vh; font-family: sans-serif; flex-direction: column; }
    .logo-side { background-color: #003f77; display: flex; align-items: center; justify-content: center; min-height: 200px; padding: 20px; }
    .form-side { background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; flex: 1; padding: 20px; }
    .logo-image { max-width: 220px; height: auto; }
    .login-box { background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; }
    @media (min-width: 768px) {
      .main-container { flex-direction: row; }
      .logo-side { flex: 0.4; min-height: 100vh; }
      .form-side { flex: 0.6; }
    }
    .title { font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 24px; color: #111827; }
    .form { display: flex; flex-direction: column; }
    .input-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
    .label { margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151; }
    .input { padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; font-size: 16px; }
    .button { padding: 12px; border-radius: 4px; border: none; background-color: #2A79C8; color: white; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .version-text { font-size: 12px; color: #E59400; text-align: right; margin-top: 16px; }
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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [ds_login, setDsLogin] = useState('');
  const [ds_senha, setDsSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertConfig>({ isOpen: false, type: 'info', message: '', onClose: () => {} });

  const closeAlert = () => setAlert((prev) => ({ ...prev, isOpen: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const responseData = await login({ ds_login, ds_senha });
      
      if (responseData && responseData.user) {
        localStorage.setItem('user_pk', responseData.user.pk.toString());

        if (responseData.needsPasswordChange) {
          setAlert({
            isOpen: true,
            type: 'info',
            title: 'Alteração de Senha Necessária',
            message: 'Sua senha temporária precisa ser alterada. Você será redirecionado.',
            onClose: () => {
              closeAlert();
              router.push('/change-password');
            },
          });
        } else {
          // Removido o alerta de sucesso para ir direto ao dashboard
          router.push('/dashboard');
        }
      }

    } catch (err: any) {
      setAlert({ 
        isOpen: true, 
        type: 'error', 
        title: 'Credenciais Inválidas', 
        message: 'Login ou senha não reconhecidos. Por favor, verifique suas credenciais.', 
        onClose: closeAlert 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResponsiveStyles />
      <AlertDialog 
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={alert.onClose}
      />
      <div className="main-container">
        <div className="logo-side">
          <img src="https://server.gpros.com.br/comercial/logos/logo_base.png" alt="GPROS Logo" className="logo-image" />
        </div>
        <div className="form-side">
          <div className="login-box">
            <h1 className="title">Bem-vindo</h1>
            <form className="form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="ds_login" className="label">Login</label>
                <input type="text" id="ds_login" name="ds_login" required className="input" value={ds_login} onChange={(e) => setDsLogin(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="ds_senha" className="label">Senha</label>
                <input type="password" id="ds_senha" name="ds_senha" required className="input" value={ds_senha} onChange={(e) => setDsSenha(e.target.value)} />
              </div>
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <p className="version-text">v1.0.0</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
