import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { syncMarketingToDB } from "./utils/syncMarketingToDB.js";

dotenv.config();

import db, { isRemote } from "./utils/db.js";

if (isRemote) {
    console.log("✅ Verificação de Conexão: Modo Remoto (Turso) ativado.");
} else {
    console.log("✅ Verificação de Conexão: Modo Local (SQLite) ativado.");
}

console.log("DB Loaded check:", !!db);

// Importação de rotas
import publicAuthRoutes from "./routes/public/publicAuthRoutes.js";
import thumbProxyController from "./controllers/public/thumbProxyController.js";
import downloadProxyController from "./controllers/public/downloadProxyController.js";
import marketingController from "./controllers/public/marketingController.js";

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_BUILD_PATH = path.join(path.resolve(), '..', 'client', 'dist');
app.use(express.static(CLIENT_BUILD_PATH));

// ========== ROTAS DA API ==========
app.use("/api/public", publicAuthRoutes);
app.use("/api/public", thumbProxyController);
app.use("/api/public", downloadProxyController);
app.use("/api/public", marketingController);

// Rota raiz de teste
app.get("/", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "🚀 Servidor do Repositório de Marketing ativo!",
        rotas: [
            "/api/public/login",
            "/api/public/marketing",
            "/api/public/marketing/:slug",
            "/api/public/thumb?fileId=xxx",
            "/api/public/download?fileId=xxx"
        ]
    });
});

// Fallback para SPA (React Router)
app.get('*', (req, res) => {
    console.log(`Requisição não tratada: ${req.url}. Servindo index.html.`);
    res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

const PORT = process.env.PORT || 3000;

// ========== INICIALIZAÇÃO DO SERVIDOR ==========
async function startServer() {
    app.listen(PORT, () => {
        console.log(`\n🌐 Servidor rodando na porta ${PORT}\n`);
        console.log("📦 Iniciando sincronização do Marketing Drive...\n");

        // Sincronização inicial (executa ao subir o servidor)
        syncMarketingToDB().catch(e => {
            console.error("❌ Erro na sincronização inicial do Marketing:", e.message);
        });

        // Sincronização periódica a cada 10 minutos (opcional)
        const SYNC_INTERVAL = 10 * 60 * 1000; // 10 minutos
        setInterval(() => {
            console.log("\n⏰ Executando sincronização periódica...\n");
            syncMarketingToDB().catch(e => {
                console.error("❌ Erro na sincronização periódica:", e.message);
            });
        }, SYNC_INTERVAL);
    });
}

startServer();