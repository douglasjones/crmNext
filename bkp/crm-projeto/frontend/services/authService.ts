import { api } from './api';

const authService = {
  login: async (credentials: any) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro de autenticação');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        throw new Error('Ocorreu um erro inesperado.');
      }
    }
  },

  changePassword: async (userPk: number, newPassword: string) => {
    try {
      const response = await api.post(`/change-password/${userPk}`, { newPassword });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao alterar a senha.');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor para alterar a senha. Verifique sua conexão.');
      } else {
        throw new Error('Ocorreu um erro inesperado ao alterar a senha.');
      }
    }
  },
};

export default authService;

