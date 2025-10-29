import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { syncDriveToDB } from "./utils/syncDriveToDB.js";
import { syncEtiquetasToDB } from "./utils/syncEtiquetasToDB.js";

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
import downloadProxyController from "./controllers/public/downloadProxyController.js"
import etiquetasController from "./controllers/public/etiquetasController.js"

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_BUILD_PATH = path.join(path.resolve(), '..', 'repositorio-frontend-react', 'dist');

app.use(express.static(CLIENT_BUILD_PATH));

// Rotas públicas
app.use("/api/public", publicAuthRoutes);
app.use("/api/public", publicPromocoesRoutes);
app.use("/api/public", thumbProxyController);
app.use("/api/public", downloadProxyController);
app.use("/api/public", etiquetasController);

// Teste get
//app.get("/", (req, res) => {
//    res.json({
//        sucesso: true,
//        mensagem: "Servidor do Repositório de Promoções e Etiquetas ativo!",
//        rotas: ["/api/public/login", "/api/public/promocoes"]
//    });
//});

app.get('*', (req, res) => {
    console.log(`Requisição não tratada: ${req.url}. Servindo index.html.`);
   res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

const PORT = process.env.PORT || 3000;

// LÓGICA DE INICIALIZAÇÃO
async function startServer() {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em ${PORT}`);
        console.log("Iniciando rotinas de sincronização...");

        syncDriveToDB().catch(e => {
            console.error("Erro na rotina de Promoções:", e.message);
        });

        syncEtiquetasToDB().catch(e => {
            console.error("Erro na rotina de Etiquetas:", e.message);
        })

    });
}

startServer();