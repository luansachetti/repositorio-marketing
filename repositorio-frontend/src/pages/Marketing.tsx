// src/pages/Marketing.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarMarketing, MarketingNode } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function Marketing() {
  const { usuario } = useAuth();
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

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
        <p className="text-lg font-medium">Carregando categorias...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white text-center p-6">
        <p className="text-lg font-medium mb-4">{erro}</p>
        <Button label="Voltar" onClick={() => navigate("/menu")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
      <Header />

      <main className="flex flex-col justify-center items-center flex-1 p-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/20 p-6 w-full max-w-5xl">
          <h1 className="text-xl font-semibold mb-6">
            Materiais de Marketing — {usuario?.nome_exibicao}
          </h1>

          {categorias.length === 0 ? (
            <p className="text-orange-100">Nenhuma categoria disponível.</p>
          ) : (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              {categorias.map((categoria) => {
                const totalArquivos = contarArquivos(categoria);
                
                return (
                  <div
                    key={categoria.id}
                    onClick={() => abrirCategoria(categoria.slug)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 cursor-pointer hover:bg-white/20 transition-all duration-200 active:scale-95 shadow-md"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {/* Ícone de pasta */}
                      <div className="bg-white/20 rounded-lg p-3">
                        <svg
                          className="w-10 h-10 text-white"
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

                      {/* Nome da categoria */}
                      <h3 className="text-lg font-semibold text-white text-center">
                        {categoria.name}
                      </h3>

                      {/* Badge com total de arquivos */}
                      <span className="bg-orange-600/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {totalArquivos} {totalArquivos === 1 ? 'arquivo' : 'arquivos'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => navigate("/menu")}
            className="mt-6 text-sm text-orange-100 underline hover:text-white transition"
          >
            ← Voltar ao menu
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}