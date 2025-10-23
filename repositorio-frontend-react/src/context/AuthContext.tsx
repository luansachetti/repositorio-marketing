import { createContext, useContext, useState, ReactNode } from "react";

type Usuario = {
  id: number;
  usuario: string;
  nome_exibicao: string;
  tipo: string;
  ativo: number;
};

type AuthContextType = {
  usuario: Usuario | null;
  login: (dados: Usuario) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });

  const login = (dados: Usuario) => {
    setUsuario(dados);
    localStorage.setItem("usuario", JSON.stringify(dados));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");

  // 💡 Retorna um objeto com "usuario!" (garantido)
  return {
    ...context,
    usuario: context.usuario!, // o ponto de exclamação diz ao TS que não é null
  };
};
