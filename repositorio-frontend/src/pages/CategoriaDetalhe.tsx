// src/pages/CategoriaDetalhe.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarCategoria, MarketingNode } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function CategoriaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { usuario } = useAuth();
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
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-white/15 transition-all duration-200"
        >
          {/* Thumbnail */}
          {node.thumbUrl ? (
            <img
              src={node.thumbUrl}
              alt={node.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-white/20 flex-shrink-0"
              onError={(e) => {
                const img = e.currentTarget;
                img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23ffffff' fill-opacity='0.2' width='96' height='96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-size='40'%3E📄%3C/text%3E%3C/svg%3E";
              }}
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-white/10 rounded-lg border border-white/20 text-4xl flex-shrink-0">
              📄
            </div>
          )}

          {/* Info do arquivo */}
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-semibold text-white text-sm sm:text-base">
              {node.name}
            </h4>
            {node.mimeType && (
              <p className="text-xs text-orange-100 mt-1">
                {node.mimeType.split("/")[1]?.toUpperCase() || "Arquivo"}
              </p>
            )}
          </div>

          {/* Botão de download */}
          {node.downloadUrl && (
            <a
              href={node.downloadUrl}
              download
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 font-semibold text-sm shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4"
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
      );
    }

    // Se for pasta, renderiza os filhos
    if (node.type === "folder" && node.children && node.children.length > 0) {
      return (
        <div key={node.id} className={nivel > 0 ? "ml-4 mt-4" : ""}>
          {nivel > 0 && (
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-orange-200"
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
          <div className="space-y-3">
            {node.children.map((child) => renderizarNode(child, nivel + 1))}
          </div>
        </div>
      );
    }

    return null;
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
        <p className="text-lg font-medium">Carregando arquivos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white text-center p-6">
        <p className="text-lg font-medium mb-4">{erro}</p>
        <Button label="Voltar" onClick={() => navigate("/marketing")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
      <Header />

      <main className="flex flex-col justify-center items-center flex-1 p-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/20 p-6 w-full max-w-5xl">
          <h1 className="text-xl font-semibold mb-6">
            {categoria?.name} — {usuario?.nome_exibicao}
          </h1>

          {categoria && categoria.children && categoria.children.length > 0 ? (
            <div className="space-y-3 text-left">
              {renderizarNode(categoria)}
            </div>
          ) : (
            <p className="text-orange-100">Nenhum arquivo disponível nesta categoria.</p>
          )}

          <button
            onClick={() => navigate("/marketing")}
            className="mt-6 text-sm text-orange-100 underline hover:text-white transition"
          >
            ← Voltar para categorias
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}