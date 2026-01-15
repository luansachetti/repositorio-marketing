// src/pages/Menu.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sincronizarDrive } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function Menu() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [sincronizando, setSincronizando] = useState(false);
  const [mensagemSync, setMensagemSync] = useState("");

  // Verifica se o usuário é admin
  const isAdmin = usuario?.tipo === "admin";

  async function handleSync() {
    try {
      setSincronizando(true);
      setMensagemSync("");

      const resposta = await sincronizarDrive();

      if (resposta.sucesso) {
        setMensagemSync("✅ Sincronização concluída com sucesso!");
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => setMensagemSync(""), 5000);
      } else {
        setMensagemSync("❌ Erro ao sincronizar: " + resposta.mensagem);
      }
    } catch (e: any) {
      setMensagemSync("❌ Erro ao sincronizar com o servidor.");
      console.error(e);
    } finally {
      setSincronizando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
      <Header />

      <main className="flex flex-col justify-center items-center flex-1 p-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/20 p-6 w-full max-w-3xl">
          <h1 className="text-xl font-semibold mb-2">
            Bem-vindo(a), {usuario?.nome_exibicao}!
          </h1>
          <p className="text-orange-100 mb-6 text-sm">
            Selecione uma opção abaixo para começar
          </p>

          <div className="grid gap-4 sm:grid-cols-1">
            {/* Botão principal - Materiais de Marketing */}
            <Button
              label="📦 Materiais de Marketing"
              onClick={() => navigate("/marketing")}
            />

            {/* Botão de sincronização - Apenas para Admin */}
            {isAdmin && (
              <Button
                label={sincronizando ? "🔄 Sincronizando..." : "🔄 Sincronizar Drive"}
                onClick={handleSync}
                disabled={sincronizando}
                variant="secondary"
              />
            )}
          </div>

          {/* Mensagem de feedback da sincronização */}
          {mensagemSync && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              mensagemSync.includes("✅") 
                ? "bg-green-500/20 border border-green-400/30 text-green-100"
                : "bg-red-500/20 border border-red-400/30 text-red-100"
            }`}>
              {mensagemSync}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
