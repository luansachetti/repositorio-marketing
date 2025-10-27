// /api/public/thumb (seu arquivo de rota)

import express from "express";
import { getDriveClient } from "../../utils/driveUtils";
import { drive_v3 } from "googleapis";

const router = express.Router();

// Proxy para miniaturas do Google Drive
router.get("/thumb", async (req, res) => {
    const { fileId } = req.query;

    if (!fileId || typeof fileId !== "string") {
        return res.status(400).json({
            sucesso: false,
            mensagem: "ID do arquivo (fileId) da miniatura ausente.",
        });
    }

    try {
        const drive = getDriveClient();

        const response = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        }, { 
            responseType: 'stream'
        });

        const contentType = response.headers['content-type'] || 'image/jpeg';
        const contentLength = response.headers['content-length'] || '';

        res.setHeader("Content-Type", contentType);
        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }

        response.data.pipe(res);

    } catch (error: any) {
        console.error("Erro ao obter miniatura via Drive API:", error.message);
        
        const statusCode = error.response?.status || 500;
        
        res.status(statusCode).json({
            sucesso: false,
            mensagem: `Erro ao obter miniatura. Status: ${statusCode}.`,
        });
    }
});

export default router;