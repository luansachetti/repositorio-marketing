import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Promocoes from "./pages/Promocoes";
import Categorias from "./pages/Categorias";
import Arquivos from "./pages/Arquivos";
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
          <Route path="/" element={<Login />} />

          <Route
            path="/menu"
            element={
              <RotaPrivada>
                <Menu />
              </RotaPrivada>
            }
          />

          <Route
            path="/promocoes"
            element={
              <RotaPrivada>
                <Promocoes />
              </RotaPrivada>
            }
          />

          <Route
            path="/categorias"
            element={
              <RotaPrivada>
                <Categorias />
              </RotaPrivada>
            }
          />

          <Route
            path="/arquivos"
            element={
              <RotaPrivada>
                <Arquivos />
              </RotaPrivada>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
