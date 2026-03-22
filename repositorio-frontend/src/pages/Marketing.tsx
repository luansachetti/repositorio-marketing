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
                  <Button
                    key={categoria.id}
                    label={`📦 ${categoria.name} (${totalArquivos} ${totalArquivos === 1 ? "arquivo" : "arquivos"})`}
                    onClick={() => abrirCategoria(categoria.slug)}
                  />
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
