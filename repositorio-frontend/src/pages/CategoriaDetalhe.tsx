// src/pages/CategoriaDetalhe.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarCategoria, MarketingNode } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function CategoriaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState<MarketingNode | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (slug) {
      carregarCategoria(slug);
    }
  }, [slug]);

  async function carregarCategoria(slug: string) {
    try {
      setCarregando(true);
      const resposta = await buscarCategoria(slug);

      if (resposta.sucesso) {
        setCategoria(resposta.categoria);
      } else {
        setErro("Categoria não encontrada.");
      }
    } catch (e: any) {
      setErro("Erro ao carregar categoria.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  // Renderiza a estrutura recursivamente
  function renderizarNode(node: MarketingNode, nivel: number = 0) {
    if (node.type === "file") {
      return (
        <div
          key={node.id}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-4"
        >
          <div className="p-4 flex items-center gap-4">
            {/* Thumbnail */}
            {node.thumbUrl && (
              <img
                src={node.thumbUrl}
                alt={node.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='12'%3EImagem%3C/text%3E%3C/svg%3E";
                }}
              />
            )}

            {/* Info do arquivo */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{node.name}</h4>
              {node.mimeType && (
                <p className="text-xs text-gray-500 mt-1">
                  {node.mimeType.split("/")[1]?.toUpperCase() || "Arquivo"}
                </p>
              )}
            </div>

            {/* Botão de download */}
            {node.downloadUrl && (
              <a
                href={node.downloadUrl}
                download
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Baixar
              </a>
            )}
          </div>
        </div>
      );
    }

    // Se for pasta, renderiza os filhos
    if (node.type === "folder" && node.children && node.children.length > 0) {
      return (
        <div key={node.id} className={nivel > 0 ? "ml-6 mt-4" : ""}>
          {nivel > 0 && (
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
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
              {node.name}
            </h3>
          )}
          <div className="space-y-2">
            {node.children.map((child) => renderizarNode(child, nivel + 1))}
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Botão voltar */}
          <Button
            onClick={() => navigate("/marketing")}
            className="mb-6 bg-gray-600 hover:bg-gray-700" label={""}          >
            ← Voltar para Categorias
          </Button>

          {carregando && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando arquivos...</p>
            </div>
          )}

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {erro}
            </div>
          )}

          {!carregando && !erro && categoria && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {categoria.name}
              </h1>

              {categoria.children && categoria.children.length > 0 ? (
                renderizarNode(categoria)
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-600">Nenhum arquivo disponível nesta categoria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}