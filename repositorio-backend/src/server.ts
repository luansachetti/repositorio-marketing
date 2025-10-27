import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { syncDriveToDB } from "./utils/syncDriveToDB.js";

dotenv.config();

import db, { isRemote } from "./utils/db.js";

if (isRemote) {
    console.log("Verificação de Conexão: Modo Remoto (Turso) ativado.");
} else {
    console.log("Verificação de Conexão: Modo Local (SQLite) ativado.");
}

console.log("DB Loaded check:", !!db);

import publicAuthRoutes from "./routes/public/publicAuthRoutes.js";
import publicPromocoesRoutes from "./routes/public/publicPromocoesRoutes.js";
import thumbProxyController from "./controllers/public/thumbProxyController.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use("/api/public", publicAuthRoutes);
app.use("/api/public", publicPromocoesRoutes);
app.use("/api/public", thumbProxyController);

// Teste get
app.get("/", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Servidor do Repositório de Promoções e Etiquetas ativo!",
        rotas: ["/api/public/login", "/api/public/promocoes"]
    });
});

const PORT = process.env.PORT || 3000;


// LÓGICA DE INICIALIZAÇÃO
async function startServer() {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em ${PORT}`);
        console.log("Iniciando rotina de sincronização do Google Drive (cache DB)...");
        syncDriveToDB().catch(e => {
            console.error("Erro na rotina de sincronização:", e.message);
        });
    });
}

startServer();