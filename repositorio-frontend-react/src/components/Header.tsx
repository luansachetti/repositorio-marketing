import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Header() {
  const { usuario, logout } = useAuth();

  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 text-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <img
          src="/img/logo.svg"
          alt="Logo"
          className="h-10 md:h-12 drop-shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/img/logo.png";
          }}
        />

        {/* Nome da filial */}
        <h1 className="text-sm md:text-lg font-semibold text-center flex-1 text-white truncate mx-4">
          {usuario ? usuario.nome_exibicao : "Usuário"}
        </h1>

        {/* Botão de logout */}
        <Button
          label="Sair"
          variant="secondary"
          full={false}
          onClick={logout}
          className="text-sm md:text-base py-2 px-4 rounded-lg"
        />
      </div>
    </header>
  );
}
