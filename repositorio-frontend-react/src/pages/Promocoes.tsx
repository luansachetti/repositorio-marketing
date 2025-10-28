import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarPromocoes } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

type Promocao = {
  id: number;
  nome: string;
  grupo: string;
  categoria: string;
  arquivos: {
    nome: string;
    link: string;
    thumb?: string;
  }[];
};

export default function Promocoes() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {

        const dados = await buscarPromocoes(usuario?.usuario || "default");

        if (!dados.sucesso) {
          setErro(dados.mensagem || "Nenhuma promoção disponível.");
          setPromocoes([]);
        } else {
          // Agrupar por grupo (para não repetir várias categorias)
          const gruposUnicos: { [key: string]: Promocao } = {};
          (dados.promocoes as Promocao[]).forEach((p) => {
            if (!gruposUnicos[p.grupo]) {
              gruposUnicos[p.grupo] = p;
            }
          });

          setPromocoes(Object.values(gruposUnicos));
        }
      } catch {
        setErro("Erro ao conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuario]);

  if (carregando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
        <p className="text-lg font-medium">Carregando promoções...</p>
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
            Promoções de {usuario?.nome_exibicao}
          </h1>

          {promocoes.length === 0 ? (
            <p className="text-orange-100">Nenhuma promoção disponível.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {promocoes.map((p) => (
                <Button
                  key={p.id}
                  label={p.nome}
                  onClick={() =>
                    navigate("/categorias", { state: { grupo: p.grupo } })
                  }
                />
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

      <Footer />
    </div>
  );
}
