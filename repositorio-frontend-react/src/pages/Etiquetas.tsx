import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { buscarEtiquetas, Etiqueta } from "../utils/api";
import Header from "../components/Header";

export default function Etiquetas() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [msg, setMsg] = useState("⏳ Carregando etiquetas...");

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    carregarEtiquetas();
  }, []);

  async function carregarEtiquetas() {
    try {
      const dados = await buscarEtiquetas(usuario.usuario);

      if (!dados.sucesso || !dados.etiquetas?.length) {
        setMsg("Nenhuma etiqueta disponível.");
        return;
      }

      const etiquetasFilial = dados.etiquetas.filter(
        (e: Etiqueta) =>
          !e.filial ||
          e.filial.trim().toLowerCase() === usuario.usuario.toLowerCase()
      );

      if (!etiquetasFilial.length) {
        setMsg("Nenhum arquivo disponível para sua filial.");
        return;
      }

      setEtiquetas(etiquetasFilial);
      setMsg("");
    } catch {
      setMsg("❌ Erro ao carregar etiquetas.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <Header title="🏷️ Etiquetas Disponíveis" />
      {msg && <p className="text-gray-600">{msg}</p>}

      <div className="grid gap-4 mt-6">
        {etiquetas.map((e) => (
          <div
            key={e.id || e.nome}
            className="bg-white shadow p-4 rounded-xl border border-gray-100"
          >
            <h3 className="font-semibold text-lg mb-2">{e.nome}</h3>
            {e.link_drive ? (
              <a
                href={e.link_drive}
                target="_blank"
                className="bg-vermelho hover:bg-laranja text-white py-1.5 px-4 rounded-lg inline-block"
              >
                📂 Abrir no Drive
              </a>
            ) : (
              <p className="text-sm text-gray-500">Sem link disponível</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
