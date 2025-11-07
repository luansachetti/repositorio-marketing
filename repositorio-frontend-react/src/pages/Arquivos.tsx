import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buscarPromocoes } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { startBulkDownload } from "../utils/downloadManager";

// Estrutura dos arquivos
type Arquivo = {
  nome: string;
  link: string;
  thumb?: string;
  thumb_base64?: string;
};

// Estrutura das promoções
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
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);

  useEffect(() => {
    if (!grupo || !categoria) {
      setErro("Dados da promoção não encontrados.");
      setCarregando(false);
      return;
    }

    async function carregarArquivos() {
      try {

        const dados = await buscarPromocoes(usuario?.usuario || "default");

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

  const extractFileId = (link: string): string => {
    return link; 
}

const handleBulkDownload = async () => {
    if (isBulkDownloading || arquivos.length === 0) return;

    setIsBulkDownloading(true);

    // Mapeia os arquivos para o formato que o downloadManager espera: { fileId, fileName }
    const filesToDownload = arquivos.map(a => ({
        // Usamos a.link (que presumimos ser o File ID) para obter o conteúdo
        fileId: extractFileId(a.link), 
        // Usamos a.nome como o nome do arquivo
        fileName: a.nome 
    }));

    try {
        await startBulkDownload(filesToDownload);
    } catch (error) {
        console.error("Erro no processo de download em massa:", error);
    } finally {
        setIsBulkDownloading(false);
    }
}

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

            {/* NOVO BOTÃO DE DOWNLOAD EM MASSA */}
            {arquivos.length > 0 && (
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleBulkDownload}
                        disabled={isBulkDownloading}
                        className={`
                            px-6 py-3 text-white font-bold rounded-xl shadow-lg transition duration-300 w-full sm:w-auto
                            ${isBulkDownloading 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-red-700 hover:bg-red-800 active:bg-red-900'
                            }
                        `}
                    >
                        {isBulkDownloading 
                            ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Baixando... (Não feche a página)
                                </span>
                            ) 
                            : `Baixar Todos os ${arquivos.length} Arquivos`
                        }
                    </button>
                    {isBulkDownloading && (
                         <p className="text-sm text-yellow-200 mt-2 sm:mt-0">
                            Processo sequencial em andamento.
                         </p>
                    )}
                </div>
            )}
            {/* FIM DO NOVO BOTÃO DE DOWNLOAD EM MASSA */}

          {arquivos.length === 0 ? (
            <p className="text-orange-100">Nenhum arquivo disponível.</p>
          ) : (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                    // REMOVEMOS O DOWNLOAD INDIVIDUAL FORÇADO: 
                    // Para download individual, o ideal é usar a mesma lógica do downloadManager para ser mais limpo:
                    // <button onClick={() => startBulkDownload([{ fileId: extractFileId(a.link), fileName: a.nome }])}>Baixar</button>
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

      <Footer />
    </div>
  );
}