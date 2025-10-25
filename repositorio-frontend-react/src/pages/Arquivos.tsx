import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";

// 🔹 Estrutura dos arquivos
type Arquivo = {
  nome: string;
  link: string;
  thumb?: string;
  thumb_base64?: string;
};

// 🔹 Estrutura das promoções
type Promocao = {
  id: number;
  grupo: string;
  categoria: string;
  arquivos: Arquivo[];
};

export default function Arquivos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Recebe dados via navigate
  const { grupo, categoria } =
    (location.state as { grupo: string; categoria: string }) ||
    { grupo: "", categoria: "" };

  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!grupo || !categoria) {
      setErro("Dados da promoção não encontrados.");
      setCarregando(false);
      return;
    }

    async function carregarArquivos() {
      try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const resposta = await fetch(
          `${backendUrl}/api/public/promocoes/${usuario?.usuario}`
        );
        const dados = await resposta.json();

        if (!dados.sucesso) {
          setErro(dados.mensagem || "Nenhum arquivo encontrado.");
          setArquivos([]);
          return;
        }

        const promocoes = dados.promocoes as Promocao[];
        const encontrada = promocoes.find(
          (p) => p.grupo === grupo && p.categoria === categoria
        );

        if (!encontrada || !encontrada.arquivos) {
          setErro("Nenhum arquivo disponível nesta categoria.");
          setArquivos([]);
          return;
        }

        setArquivos(encontrada.arquivos);
      } catch {
        setErro("Erro ao carregar arquivos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarArquivos();
  }, [usuario, grupo, categoria]);

  // ============================ RENDERIZAÇÃO ============================

  if (carregando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
        <p className="text-lg font-medium">Carregando arquivos...</p>
      </div>
    );

  if (erro)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white text-center p-6">
        <p className="text-lg font-medium mb-4">{erro}</p>
        <Button label="Voltar" onClick={() => navigate(-1)} />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
      <Header />

      <main className="flex flex-col justify-center items-center flex-1 p-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/20 p-6 w-full max-w-5xl">
          <h1 className="text-xl font-semibold mb-6">
            {categoria} — {usuario?.nome_exibicao}
          </h1>

          {arquivos.length === 0 ? (
            <p className="text-orange-100">Nenhum arquivo disponível.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {arquivos.map((a) => (
                <div
                  key={a.nome}
                  className="bg-white/10 border border-white/20 rounded-xl shadow p-4 flex flex-col items-center text-center hover:bg-white/20 transition"
                >
                  {/* Miniatura via Proxy */}
                  {a.thumb ? (
                    <img
                      src={a.thumb}
                      alt={a.nome}
                      className="w-32 h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";

                        const fallback = document.createElement("div");
                        fallback.className =
                          "w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-3 text-gray-400 text-4xl";
                        fallback.textContent = "📄";                        
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-3 text-gray-400 text-4xl">
                      📄
                    </div>
                  )}

                  {/* Nome e botão */}
                  <p className="text-sm font-medium text-white/90 truncate w-full">
                    {a.nome}
                  </p>

                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95"
                  >
                    Baixar
                  </a>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-sm text-orange-100 underline hover:text-white transition"
          >
            ← Voltar para categorias
          </button>
        </div>
      </main>
    </div>
  );
}
