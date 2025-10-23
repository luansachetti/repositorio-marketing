import { Router } from "express";
import { publicLogin } from "../../controllers/public/publicAuthController.js";

const router = Router();

// POST /api/public/login
router.post("/login", publicLogin);

export default router;
