// src/routes/public/publicMarketingRoutes.ts

import { Router } from "express";
import { readMarketingDrive } from "../../utils/readMarketingDrive.js";

const router = Router();

/**
 * GET /api/public/marketing
 * Retorna a árvore completa do Drive Marketing
 */
router.get("/marketing", async (req, res) => {
  try {
    const tree = await readMarketingDrive();
    res.json(tree);
  } catch (e: any) {
    console.error("Erro ao ler Marketing:", e.message);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao ler arquivos de Marketing",
    });
  }
});

export default router;
