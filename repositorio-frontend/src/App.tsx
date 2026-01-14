// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Marketing from "./pages/Marketing";
import CategoriaDetalhe from "./pages/CategoriaDetalhe";
import { JSX } from "react";

function RotaPrivada({ children }: { children: JSX.Element }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas privadas */}
          <Route
            path="/menu"
            element={
              <RotaPrivada>
                <Menu />
              </RotaPrivada>
            }
          />

          {/* Nova rota de Marketing - Lista de categorias */}
          <Route
            path="/marketing"
            element={
              <RotaPrivada>
                <Marketing />
              </RotaPrivada>
            }
          />

          {/* Rota dinâmica - Detalhes de uma categoria específica */}
          <Route
            path="/marketing/:slug"
            element={
              <RotaPrivada>
                <CategoriaDetalhe />
              </RotaPrivada>
            }
          />

          {/* Fallback - Redireciona qualquer rota não encontrada para login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}