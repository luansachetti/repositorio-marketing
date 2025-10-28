import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";
import { buscarEtiquetas } from "../utils/api"; 

type Etiqueta = {
  id: number;
  nome_categoria: string;
  file_name: string;
  link_download: string;
};

type EtiquetaApiResponse = {
    sucesso: boolean;
    mensagem?: string;
    etiquetas?: Etiqueta[];
};

export default function Etiquetas() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) {
        navigate("/login");
        return;
    }
    
    async function carregar() {
      try {
        const dados: EtiquetaApiResponse = await buscarEtiquetas(); 

        if (!dados.sucesso || !dados.etiquetas) {
          setErro(dados.mensagem || "Nenhuma etiqueta disponível.");
          setEtiquetas([]);
        } else {
          setEtiquetas(dados.etiquetas);
        }
      } catch {
        setErro("Erro ao conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuario, navigate]);

  if (carregando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
        <p className="text-lg font-medium">Carregando etiquetas...</p>
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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/20 p-6 w-full max-w-3xl">
          <h1 className="text-xl font-semibold mb-6">
            Modelos de Etiquetas
          </h1>

          {etiquetas.length === 0 ? (
            <p className="text-orange-100">Nenhum modelo de etiqueta disponível.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {etiquetas.map((e) => (
                <a
                  key={e.id}
                  href={e.link_download}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    label={e.nome_categoria}
                  />
                </a>
              ))}
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
    </div>
  );
}