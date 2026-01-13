const BASE_URL = import.meta.env.VITE_API_URL;

// Tipos genéricos usados em várias rotas
export interface Usuario {
  id: number;
  usuario: string;
  nome_exibicao: string;
  senha: string;
  tipo: "admin" | "filial";
  ativo: number;
}

export interface Promocao {
  id: number;
  tipo: string;
  nome: string;
  grupo: string;
  categoria: string;
  id_pasta: string;
  usuarios_vinculados: string[];
  arquivos: { nome: string; link: string; thumb?: string }[];
  ativo: number;
}

export interface Etiqueta {
  id: number;
  nome_categoria: string;
  file_id: string;
  file_name: string;
  link_download: string;
}

// FUNÇÕES PÚBLICAS

// Login de filial/admin
export async function loginUsuario(usuario: string, senha: string) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });

  return res.json();
}

// Promoções da filial
export async function buscarPromocoes(filial: string) {
  const res = await fetch(`${BASE_URL}/api/promocoes/${filial}`);
  return res.json();
}

// Etiquetas da filial
export async function buscarEtiquetas() {
  const res = await fetch(`${BASE_URL}/api/etiquetas/`);
  return res.json();
}

// Função genérica de GET (pode usar para admin futuramente)
export async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error("Erro ao acessar API");
  return res.json();
}
