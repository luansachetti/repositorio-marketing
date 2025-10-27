import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { loginUsuario } from "../utils/api";
import Footer from "../components/Footer";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      
      const dados = await loginUsuario(usuario, senha);

      if (!dados.sucesso) {
        setErro(dados.mensagem || "Usuário ou senha incorretos.");
        return;
      }

      login(dados.usuario);
      navigate("/menu");
    } catch {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }
  
  const base = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 text-white p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-orange-900/30 p-8 w-full max-w-sm text-center">
        {/* 🔹 Logo */}
        
        <img
          src={`${base}img/logo.svg`}
          alt="Logo"
          className="h-14 mx-auto mb-6 drop-shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `${base}img/logo.png`;
          }}
        />

        <h1 className="text-2xl font-bold mb-2">Acesso ao Repositório</h1>
        <p className="text-sm text-orange-100 mb-6">
          Entre com seu usuário e senha
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-sm font-medium text-white/90">Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value.toLowerCase())}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="ex: apiuna01"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white/90">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="••••••••"
              required
            />
          </div>

          {erro && (
            <p className="text-red-200 text-center text-sm font-semibold">
              {erro}
            </p>
          )}

          <Button
            label={carregando ? "Entrando..." : "Entrar"}
            type="submit"
            disabled={carregando}
          />
        </form>
      </div>

      <Footer />
    </div>
  );
}
