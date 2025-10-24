import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./utils/db.js";
import publicAuthRoutes from "./routes/public/publicAuthRoutes.js";
import publicPromocoesRoutes from "./routes/public/publicPromocoesRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use("/api/public", publicAuthRoutes);
app.use("/api/public", publicPromocoesRoutes);

// Teste get
app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    mensagem: "Servidor do Repositório de Promoções e Etiquetas ativo!",
    rotas: ["/api/public/login", "/api/public/promocoes"]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
