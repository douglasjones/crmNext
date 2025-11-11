import { api } from './api';

// Interfaces para os dados do usuário
export interface User {
  pk: number;
  ds_usuario: string;
  ds_login: string;
  ic_status: number;
}

// Usado para buscar dados para o formulário de edição
export interface UserFormData extends Omit<User, 'pk'> {
  ds_cel?: string;
}

// Usado para enviar dados para criar/atualizar
export interface UserPayload {
  ds_usuario: string;
  ds_login: string;
  ds_senha?: string; // Senha é opcional na atualização
  ds_cel?: string;
  ic_status: number;
}

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  async getUserById(id: number): Promise<UserFormData> {
    try {
      const response = await api.get<UserFormData>(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  async createUser(data: UserPayload): Promise<any> {
    try {
      const response = await api.post('/usuarios', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUser(id: number, data: UserPayload): Promise<any> {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }
}

export const userService = new UserService();
