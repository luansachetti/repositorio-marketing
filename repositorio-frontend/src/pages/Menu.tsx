// src/pages/Menu.tsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Menu() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const opcoes = [
    {
      titulo: "Materiais de Marketing",
      descricao: "Acesse todos os materiais organizados por categoria",
      icone: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      rota: "/marketing",
      cor: "from-blue-500 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo(a), {usuario?.nome_exibicao}!
            </h1>
            <p className="text-gray-600">
              Selecione uma opção abaixo para começar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opcoes.map((opcao, index) => (
              <div
                key={index}
                onClick={() => navigate(opcao.rota)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${opcao.cor} p-8 rounded-t-xl`}>
                  <div className="text-white">{opcao.icone}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {opcao.titulo}
                  </h3>
                  <p className="text-gray-600">{opcao.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
