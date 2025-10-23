import { Router } from "express";
import { listarPromocoesPorFilial } from "../../controllers/public/publicPromocoesController.js";

const router = Router();

// GET /api/public/promocoes/:filial
router.get("/promocoes/:filial", listarPromocoesPorFilial);

export default router;
