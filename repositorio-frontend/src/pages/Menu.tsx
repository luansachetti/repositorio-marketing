// src/pages/Menu.tsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function Menu() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

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
            <Button
              label="📦 Materiais de Marketing"
              onClick={() => navigate("/marketing")}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
