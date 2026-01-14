// src/controllers/public/marketingController.ts

import { Router } from "express";
import { query } from "../../utils/query.js";
import { MarketingNode } from "../../utils/readMarketingDrive.js";

const router = Router();

// GET /api/public/marketing
// Retorna toda a estrutura de pastas e arquivos do Marketing
router.get("/marketing", async (req, res) => {
  try {
    const rows = await query(
      "SELECT tree_json, data_sync FROM materiais_marketing ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Nenhuma estrutura de Marketing encontrada. Execute a sincronização primeiro."
      });
    }

    const tree: MarketingNode[] = JSON.parse(rows[0].tree_json);
    const lastSync = rows[0].data_sync;

    res.json({
      sucesso: true,
      ultima_sincronizacao: lastSync,
      categorias: tree,
      total_categorias: tree.length
    });

  } catch (e: any) {
    console.error("Erro ao buscar materiais de Marketing:", e.message);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar materiais de Marketing.",
      erro: e.message
    });
  }
});

// GET /api/public/marketing/:slug
// Retorna uma categoria específica pelo slug
router.get("/marketing/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const rows = await query(
      "SELECT tree_json FROM materiais_marketing ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Estrutura não sincronizada."
      });
    }

    const tree: MarketingNode[] = JSON.parse(rows[0].tree_json);
    const categoria = tree.find(c => c.slug === slug);

    if (!categoria) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Categoria '${slug}' não encontrada.`
      });
    }

    res.json({
      sucesso: true,
      categoria
    });

  } catch (e: any) {
    console.error("Erro ao buscar categoria:", e.message);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar categoria.",
      erro: e.message
    });
  }
});

export default router;