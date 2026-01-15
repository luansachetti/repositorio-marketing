// src/utils/api.tsx

const BASE_URL = import.meta.env.VITE_API_URL;

// ========== TIPOS ==========

export interface Usuario {
  id: number;
  usuario: string;
  nome_exibicao: string;
  senha: string;
  tipo: "admin" | "filial";
  ativo: number;
}

// Tipo para a estrutura recursiva do Marketing
export interface MarketingNode {
  id: string;
  name: string;
  slug: string;
  type: "folder" | "file";
  mimeType?: string | null;
  downloadUrl?: string;
  thumbUrl?: string;
  children?: MarketingNode[];
}

export interface RespostaMarketing {
  sucesso: boolean;
  ultima_sincronizacao: string;
  categorias: MarketingNode[];
  total_categorias: number;
}

export interface RespostaCategoriaUnica {
  sucesso: boolean;
  categoria: MarketingNode;
}

export interface RespostaSync {
  sucesso: boolean;
  mensagem: string;
  timestamp?: string;
  erro?: string;
}

// ========== FUNÇÕES DE API ==========

// Login de filial/admin
export async function loginUsuario(usuario: string, senha: string) {
  const res = await fetch(`${BASE_URL}/api/public/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });

  return res.json();
}

// Buscar todas as categorias de Marketing
export async function buscarMarketing(): Promise<RespostaMarketing> {
  const res = await fetch(`${BASE_URL}/api/public/marketing`);
  if (!res.ok) throw new Error("Erro ao buscar materiais de Marketing");
  return res.json();
}

// Buscar categoria específica por slug
export async function buscarCategoria(slug: string): Promise<RespostaCategoriaUnica> {
  const res = await fetch(`${BASE_URL}/api/public/marketing/${slug}`);
  if (!res.ok) throw new Error(`Erro ao buscar categoria: ${slug}`);
  return res.json();
}

// Forçar sincronização manual (Admin only)
export async function sincronizarDrive(): Promise<RespostaSync> {
  const res = await fetch(`${BASE_URL}/api/admin/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Erro ao sincronizar com o Drive");
  return res.json();
}

// Função genérica de GET
export async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error("Erro ao acessar API");
  return res.json();
}