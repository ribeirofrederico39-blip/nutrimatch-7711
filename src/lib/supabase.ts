import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export interface User {
  id: string;
  email: string;
  nome: string;
  peso?: number;
  altura?: number;
  idade?: number;
  genero?: 'male' | 'female';
  rotina?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  objetivo?: 'lose' | 'maintain' | 'gain';
  orcamento?: 'low' | 'medium' | 'high';
  restricoes?: string;
  plano_tipo: 'free' | 'premium';
  consultas_ia_mes: number;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  data_criacao: string;
  meta_calorias: number;
  tipo: 'low' | 'medium' | 'high';
  custo_total_dia?: number;
  ativo: boolean;
  created_at: string;
}

export interface Meal {
  id: string;
  plan_id: string;
  nome_refeicao: string;
  alimentos: string[];
  calorias: number;
  custo_total?: number;
  proteina?: number;
  carboidrato?: number;
  gordura?: number;
  horario_sugerido?: string;
  created_at: string;
}

export interface Food {
  id: string;
  nome: string;
  categoria?: string;
  preco_medio?: number;
  kcal?: number;
  proteina?: number;
  carboidrato?: number;
  gordura?: number;
  porcao_padrao?: string;
  alternativas?: string[];
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  peso_atual: number;
  data: string;
  observacoes?: string;
  imc?: number;
  created_at: string;
}
