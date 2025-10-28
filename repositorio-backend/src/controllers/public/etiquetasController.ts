// etiquetasController.ts

import express from "express";
import { query } from "../../utils/query.js";

const router = express.Router();

// Define a interface para o tipo de dado que será retornado do DB
interface EtiquetaDB {
    id: number;
    nome_categoria: string;
    file_id: string;
    file_name: string;
    link_download: string;
}

router.get("/etiquetas", async (req, res) => {
    try {
        // Simplesmente seleciona todos os registros da tabela 'etiquetas'
        const etiquetas: EtiquetaDB[] = await query("SELECT * FROM etiquetas ORDER BY nome_categoria ASC");

        return res.status(200).json({
            sucesso: true,
            etiquetas: etiquetas,
        });
    } catch (error) {
        console.error("Erro ao buscar etiquetas:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao buscar etiquetas.",
        });
    }
});

export default router;