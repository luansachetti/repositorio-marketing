import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

export default function Menu() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white">
      <Header />

      <main className="flex flex-col justify-center items-center flex-1 p-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/20 p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-8">
            Bem-vindo{usuario ? `, ${usuario.nome_exibicao}` : ""}
          </h1>

          <div className="flex flex-col gap-4">
            <Button label="Promoções" 
              onClick={() => navigate("/promocoes")} 
            />
            <Button
              label="Etiquetas"
              onClick={() => navigate("/etiquetas")}
            />
          </div>

          <p className="mt-8 text-sm text-orange-100">
            Escolha uma opção acima para continuar.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
