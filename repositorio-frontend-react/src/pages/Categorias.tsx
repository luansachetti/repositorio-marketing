import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";

type Promocao = {
  id: number;
  nome: string;
  grupo: string;
  categoria: string;
};

export default function Categorias() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Recebe o grupo selecionado da tela anterior
  const { grupo } = (location.state as { grupo: string }) || { grupo: "" };

  const [categorias, setCategorias] = useState<string[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!grupo) {
      setErro("Nenhuma promoção selecionada.");
      setCarregando(false);
      return;
    }

    async function carregarCategorias() {
      try {
        const resposta = await fetch(
          `http://localhost:3000/api/public/promocoes/${usuario?.usuario}`
        );
        const dados = await resposta.json();

        if (!dados.sucesso) {
          setErro(dados.mensagem || "Nenhuma categoria disponível.");
          return;
        }

        const promocoes = dados.promocoes as Promocao[];

        // Pega apenas as categorias do grupo selecionado
        const categoriasUnicas = [
          ...new Set(
            promocoes
              .filter((p) => p.grupo === grupo)
              .map((p) => p.categoria)
          ),
        ];

        setCategorias(categoriasUnicas);
      } catch {
        setErro("Erro ao carregar categorias.");
      } finally {
        setCarregando(false);
      }
    }

    carregarCategorias();
  }, [usuario, grupo]);

  if (carregando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
        <p className="text-lg font-medium">Carregando categorias...</p>
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
          <h1 className="text-xl font-semibold mb-6">{grupo}</h1>

          {categorias.length === 0 ? (
            <p className="text-orange-100">Nenhuma categoria disponível.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  label={categoria}
                  onClick={() =>
                    navigate("/arquivos", { state: { grupo, categoria } })
                  }
                />
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/promocoes")}
            className="mt-6 text-sm text-orange-100 underline hover:text-white transition"
          >
            ← Voltar para promoções
          </button>
        </div>
      </main>
    </div>
  );
}
