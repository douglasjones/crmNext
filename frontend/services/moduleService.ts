import { api } from './api';

export interface ModuleItem {
  pk: number;
  ds_modulo: string;
  ds_dominio: string;
  tipo_modulo_pk: number;
  ic_menu: number;
  nr_ordem_menu: number | null;
  modulo_pai_pk: number | null; // Added
  ds_icone: string | null;
  dt_cadastro: string;
  usuario_cadastro_pk: number;
  dt_ult_atualizacao: string;
  usuario_ult_atualizacao_pk: number;
}

export const moduleService = {
  getModules: async (): Promise<ModuleItem[]> => {
    const response = await api.get<ModuleItem[]>('/modules');
    return response.data;
  },
};
