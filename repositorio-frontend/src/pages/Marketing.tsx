// src/pages/Marketing.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarMarketing, MarketingNode } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Marketing() {
  const [categorias, setCategorias] = useState<MarketingNode[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setCarregando(true);
      const resposta = await buscarMarketing();
      
      if (resposta.sucesso) {
        setCategorias(resposta.categorias);
      } else {
        setErro("Nenhuma categoria encontrada.");
      }
    } catch (e: any) {
      setErro("Erro ao carregar categorias de Marketing.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  function abrirCategoria(slug: string) {
    navigate(`/marketing/${slug}`);
  }

  // Conta total de arquivos em uma categoria (recursivo)
  function contarArquivos(node: MarketingNode): number {
    if (node.type === "file") return 1;
    if (!node.children) return 0;
    return node.children.reduce((acc, child) => acc + contarArquivos(child), 0);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Materiais de Marketing
          </h1>
          <p className="text-gray-600 mb-8">
            Selecione uma categoria para visualizar os materiais disponíveis
          </p>

          {carregando && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando categorias...</p>
            </div>
          )}

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {erro}
            </div>
          )}

          {!carregando && !erro && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorias.map((categoria) => {
                const totalArquivos = contarArquivos(categoria);
                
                return (
                  <div
                    key={categoria.id}
                    onClick={() => abrirCategoria(categoria.slug)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                        </div>
                        <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {totalArquivos} {totalArquivos === 1 ? 'arquivo' : 'arquivos'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {categoria.name}
                      </h3>

                      <p className="text-gray-600 text-sm">
                        Clique para visualizar os materiais
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!carregando && !erro && categorias.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhuma categoria disponível no momento.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}