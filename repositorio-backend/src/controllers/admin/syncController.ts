// src/controllers/admin/syncController.ts

import { Router } from "express";
import { syncMarketingToDB } from "../../utils/syncMarketingToDB.js";

const router = Router();

// POST /api/admin/sync
// Força a sincronização manual do Drive → Banco
router.post("/sync", async (req, res) => {
  try {
    console.log("\n🔄 Sincronização MANUAL iniciada pelo admin...\n");

    // Executa a sincronização
    await syncMarketingToDB();

    res.json({
      sucesso: true,
      mensagem: "Sincronização concluída com sucesso!",
      timestamp: new Date().toISOString()
    });

  } catch (e: any) {
    console.error("❌ Erro na sincronização manual:", e.message);
    
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao sincronizar com o Drive.",
      erro: e.message
    });
  }
});

export default router;